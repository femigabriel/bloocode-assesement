'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';

interface Podcast {
  id: number;
  title: string;
  picture_url: string;
  author: string;
}

interface Episode {
  id: number;
  podcast_id: number;
  content_url: string;
  title: string;
  description: string;
  published_at: string;
  picture_url: string;
  duration: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.05,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
};

const iconVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.9 },
};

const cleanDescription = (text: string): string => {
  return text
    .replace(/<a[^>]+href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .trim();
};

const formatDate = (date: string): string => {
  return new Date(date)
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} mins`;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const fetchEpisodeDetails = async (episodeId: string, podcastId: string): Promise<Episode> => {
  if (!podcastId) {
    throw new Error('Podcast ID is missing');
  }
  try {
    const { data } = await axios.get(
      `https://api.wokpa.app/api/listeners/podcasts/${podcastId}/episodes?page=1&per_page=20`
    );
    const episodes = Array.isArray(data?.data?.data) ? data.data.data : [];
    const episode = episodes.find((e: Episode) => e.id === Number(episodeId));
    if (!episode) {
      throw new Error(`Episode with ID ${episodeId} not found`);
    }
    return episode;
  } catch (error: any) {
    console.error('Episode Fetch Error:', error.response?.status, error.message, error.response?.data);
    throw new Error('Failed to fetch episode details');
  }
};

const fetchPodcastDetails = async (podcastId: string): Promise<Podcast> => {
  if (!podcastId) {
    throw new Error('Podcast ID is missing');
  }
  try {
    const pages = [1, 2];
    const results = await Promise.all(
      pages.map((page) =>
        axios.get(`https://api.wokpa.app/api/listeners/top-podcasts?page=${page}&per_page=50`)
      )
    );
    const podcasts = results.flatMap((res) =>
      Array.isArray(res.data?.data?.data) ? res.data.data.data : []
    );
    const podcast = podcasts.find((p: Podcast) => p.id === Number(podcastId));
    if (!podcast) {
      throw new Error(`Podcast with ID ${podcastId} not found`);
    }
    return podcast;
  } catch (error: any) {
    console.error('Podcast Fetch Error:', error.response?.status, error.message, error.response?.data);
    throw new Error('Failed to fetch podcast details');
  }
};

const fetchPodcastEpisodes = async (podcastId: string): Promise<Episode[]> => {
  if (!podcastId) {
    throw new Error('Podcast ID is missing');
  }
  try {
    const { data } = await axios.get(
      `https://api.wokpa.app/api/listeners/podcasts/${podcastId}/episodes?page=1&per_page=20`
    );
    return Array.isArray(data?.data?.data) ? data.data.data : [];
  } catch (error: any) {
    console.error('Episodes Fetch Error:', error.response?.status, error.message, error.response?.data);
    return [];
  }
};

const EpisodeDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const episodeId = params.id as string;
  const podcastId = searchParams.get('podcastId') || '';

  const [notification, setNotification] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    data: episode,
    isLoading: isEpisodeLoading,
    isError: isEpisodeError,
    error: episodeError,
  } = useQuery<Episode, Error>({
    queryKey: ['episode', episodeId, podcastId],
    queryFn: () => fetchEpisodeDetails(episodeId, podcastId),
    enabled: !!podcastId,
    retry: 1,
  });

  const { data: podcast, isLoading: isPodcastLoading } = useQuery<Podcast, Error>({
    queryKey: ['podcast', podcastId],
    queryFn: () => fetchPodcastDetails(podcastId),
    enabled: !!podcastId,
    retry: 1,
  });

  const { data: episodes, isLoading: isEpisodesLoading } = useQuery<Episode[], Error>({
    queryKey: ['podcastEpisodes', podcastId],
    queryFn: () => fetchPodcastEpisodes(podcastId),
    enabled: !!podcastId,
    retry: 1,
  });

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds)
      );
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleShare = async () => {
    if (episode && navigator.share) {
      try {
        await navigator.share({
          title: episode.title,
          url: episode.content_url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      console.log('Share not supported or no episode data');
    }
  };

  const handleGift = () => {
    console.log('Gift button clicked for episode:', episode?.id);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const setAudioDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setAudioDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
      };
    }
  }, []);

  if (!podcastId) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Episode is missing.</p>
        <Link href="/" className="text-[#CC0001] hover:text-[#A30001] font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen relative">
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
        >
          {notification}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 md:px-10 py-10 max-w-7xl mx-auto"
      >
        {isEpisodeLoading ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-[157px] h-[129px] bg-gray-300 animate-pulse rounded" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
            </div>
          </div>
        ) : isEpisodeError || !episode ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">
              Unable to load episode details: {episodeError?.message || 'Unknown error'}
            </p>
            <Link href={`/podcast/${podcastId}`} className="text-[#CC0001] hover:text-[#A30001] font-medium">
              Back to Podcast
            </Link>
          </div>
        ) : (
          <motion.div
            variants={cardVariants}
            className="p-10"
            style={{
              background: 'linear-gradient(133.14deg, #2B3221 9.11%, rgba(242, 242, 242, 0) 298.89%)',
            }}
          >
            {isPodcastLoading || !podcast ? (
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6 animate-pulse" />
            ) : (
              <Link
                href={`/podcast/${podcast.id}`}
                className="flex items-center gap-2 text-white hover:text-[#8888] mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm font-medium">Back to podcast</span>
              </Link>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <Image
                  src={episode.picture_url || '/assets/images/fallback.jpg'}
                  alt={episode.title}
                  width={157}
                  height={129}
                  className="w-[157px] h-[129px] object-cover rounded shadow-md"
                  unoptimized
                  aria-label={`Cover for ${episode.title}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex gap-3 font-bold sm:gap-5 text-xs text-[#BFBFBF] mb-2">
                  <p>{formatDate(episode.published_at)}</p>
                  <p>{formatDuration(episode.duration)}</p>
                </div>
                <h1 className="text-base sm:text-lg font-semibold text-white mb-2">
                  {episode.title}
                </h1>
                <p className="text-sm sm:text-sm text-[#FFFFFF] leading-relaxed mb-6">
                  {cleanDescription(episode.description)}
                </p>
                <div className="w-full  mb-4">
                  <audio ref={audioRef} src={episode.content_url} />
                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-xs text-[#BFBFBF]">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #CC0001 ${
                          ((currentTime / duration) * 100) || 0
                        }%, #DCDCDC ${((currentTime / duration) * 100) || 0}%)`,
                      }}
                    />
                    <span className="text-xs text-[#BFBFBF]">{formatTime(duration)}</span>
                  </div>
                  <div className="w-full flex justify-between mt-5">
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => skip(-10)}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Rewind 10 seconds"
                      >
                        <Image
                          src="/assets/icons/backward.svg"
                          alt="Rewind"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </motion.button>
                      <motion.button
                        onClick={togglePlayPause}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        <Image
                          src={isPlaying ? '/assets/icons/pause.svg' : '/assets/icons/Others.svg'}
                          alt={isPlaying ? 'Pause' : 'Play'}
                          width={30}
                          height={30}
                          className="w-8 h-8"
                        />
                      </motion.button>
                      <motion.button
                        onClick={() => skip(10)}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Fast forward 10 seconds"
                      >
                        <Image
                          src="/assets/icons/forward.svg"
                          alt="Forward"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </motion.button>
                    </div>
                    <div className="flex  gap-4">
                      <motion.button
                        onClick={handleShare}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Share episode"
                      >
                        <Image
                          src="/assets/icons/Group 1156.svg"
                          alt="Share"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </motion.button>
                      <motion.button
                        onClick={handleGift}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Gift episode"
                      >
                        <Image
                          src="/assets/icons/Group 1157.svg"
                          alt="Gift"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isEpisodesLoading || !episodes ? (
          <div className="mt-10">
            <h3 className="text-sm font-bold mb-4">NEXT EPISODES IN QUEUE</h3>
            <div className="border-b-2 border-[#DCDCDC] mb-4" />
            <div className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#ffff] rounded-md shadow-sm flex-none w-60 snap-start"
                  >
                    <div className="w-full h-40 bg-gray-300 animate-pulse" />
                    <div className="p-3">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <h3 className="text-sm font-bold mb-4">NEXT EPISODES IN QUEUE</h3>
            <div className="border-b-2 border-[#DCDCDC] mb-4" />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
            >
              {episodes
                .filter((e) => e.id !== Number(episodeId))
                .map((episode, index) => (
                  <Link
                    href={`/episode/${episode.id}?podcastId=${podcastId}`}
                    key={episode.id}
                    passHref
                  >
                    <motion.div
                      variants={cardVariants}
                      custom={index}
                      whileHover="hover"
                      className="bg-[#ffff] rounded-md overflow-hidden shadow-sm flex-none w-60 snap-start"
                    >
                      <Image
                        src={episode.picture_url || '/assets/images/fallback.jpg'}
                        alt={episode.title}
                        width={240}
                        height={160}
                        className="w-full h-40 object-cover"
                        unoptimized
                      />
                      <div className="p-3">
                        <div className="flex justify-between text-xs text-[#828282] mb-1 font-bold">
                          <span>{formatDate(episode.published_at)}</span>
                          <span>{formatDuration(episode.duration)}</span>
                        </div>
                        <h4 className="font-semibold text-sm truncate">{episode.title}</h4>
                        <div className="mt-3 flex gap-3 items-center">
                          <span className="text-[#BEBEBE] text-xs">More Episodes</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('Button 1 clicked for episode:', episode.id);
                            }}
                          >
                            <Image
                              src="/assets/icons/Group 1289.svg"
                              alt="Icon 1"
                              width={20}
                              height={20}
                              draggable="false"
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('Button 2 clicked for episode:', episode.id);
                            }}
                          >
                            <Image
                              src="/assets/icons/Group 1293.svg"
                              alt="Icon 2"
                              width={20}
                              height={20}
                              draggable="false"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default EpisodeDetails;