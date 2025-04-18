'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Divider } from 'antd';

interface Podcast {
  id: number;
  title: string;
  picture_url: string;
  author: string;
  description: string;
  category_name: string;
  category_type: string;
  publisher: {
    first_name: string;
    last_name: string;
    company_name: string;
    profile_image_url: string | null;
  };
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
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const iconVariants = {
  hover: { y: -5, transition: { duration: 0.2 } },
};

const cleanDescription = (text: string): string => {
  return text
    .replace(/<a[^>]+href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .trim();
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} mins`;
};

const fetchPodcastDetails = async (id: string): Promise<Podcast> => {
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
    console.log('All Podcasts:', podcasts.map((p: Podcast) => p.id));
    const podcast = podcasts.find((p: Podcast) => p.id === Number(id));
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found in top podcasts`);
    }
    return podcast;
  } catch (error: any) {
    console.error('Podcast Fetch Error:', error.response?.status, error.message, error.response?.data);
    throw new Error('Failed to fetch podcast details');
  }
};

const fetchPodcastEpisodes = async (id: string): Promise<Episode[]> => {
  try {
    const { data } = await axios.get(
      `https://api.wokpa.app/api/listeners/podcasts/${id}/episodes?page=1&per_page=20`
    );
    console.log('Episodes Response:', data);
    return Array.isArray(data?.data?.data) ? data.data.data : [];
  } catch (error: any) {
    console.error('Episodes Fetch Error:', error.response?.status, error.message, error.response?.data);
    return [];
  }
};

const PodcastDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const [notification, setNotification] = useState<string>('');

  console.log('Podcast ID:', id);

  const {
    data: podcast,
    isLoading: isPodcastLoading,
    isError: isPodcastError,
    error: podcastError,
  } = useQuery<Podcast, Error>({
    queryKey: ['podcast', id],
    queryFn: () => fetchPodcastDetails(id),
    retry: 3,
  });

  const {
    data: episodes,
    isLoading: isEpisodesLoading,
    isError: isEpisodesError,
  } = useQuery<Episode[], Error>({
    queryKey: ['podcastEpisodes', id],
    queryFn: () => fetchPodcastEpisodes(id),
    retry: 3,
  });

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotification('Link copied!');
      setTimeout(() => setNotification(''), 2000);
    } catch (error) {
      setNotification('Failed to copy link');
      setTimeout(() => setNotification(''), 2000);
    }
  };

  const handleShare = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this ${title.includes('episode') ? 'episode' : 'podcast'}: ${title}`,
          url,
        });
        setNotification('Shared successfully!');
        setTimeout(() => setNotification(''), 2000);
      } catch (error) {
        setNotification('Sharing canceled');
        setTimeout(() => setNotification(''), 2000);
      }
    } else {
      handleCopy(url);
    }
  };

  const handleGift = () => {
    setNotification('Gift feature not implemented yet');
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <section className="min-h-screen relative">
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

      {isPodcastLoading ? (
        <div className="flex flex-col md:flex-row gap-6 px-4 sm:px-6 md:px-10 py-10 max-w-7xl mx-auto">
          <div className="w-full sm:w-80 h-80 sm:h-96 bg-gray-300 animate-pulse rounded" />
          <div className="w-full flex-1 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
          </div>
        </div>
      ) : isPodcastError ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">
            Unable to load podcast details: {podcastError?.message || 'Unknown error'}
          </p>
          <Link href="/" className="text-[#CC0001] hover:text-[#A30001] font-medium">
            Back to Home
          </Link>
        </div>
      ) : !podcast ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Podcast not found.</p>
          <Link href="/" className="text-[#CC0001] hover:text-[#A30001] font-medium">
            Back to Home
          </Link>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-6 px-4 sm:px-6 md:px-10 py-10 max-w-7xl mx-auto relative"
          style={{
            background: 'linear-gradient(133.14deg, #2B3221 9.11%, rgba(242, 242, 242, 0) 298.89%)',
          }}
        >
          <motion.div variants={imageVariants}>
            <Image
              src={podcast.picture_url || '/assets/images/fallback.jpg'}
              alt={podcast.title}
              width={400}
              height={400}
              className="w-full max-w-[320px] sm:max-w-[400px] h-auto aspect-square object-cover rounded shadow-md"
              unoptimized
              aria-label={`Cover for ${podcast.title}`}
            />
          </motion.div>
          <div className="w-full flex-1 flex items-center">
            <div className="w-full">
              <h1
                className="text-xs sm:text-sm font-bold text-[#BFBFBF] uppercase mb-4"
                data-testid="podcast-title"
              >
                {podcast.title}
              </h1>
              <p className="text-xl sm:text-2xl font-medium uppercase text-white mb-1">
                {podcast.category_name}
              </p>
              <p className="text-sm sm:text-base text-[#FFFFFF] leading-relaxed mb-6">
                {cleanDescription(podcast.description)}
              </p>
              <div className="mt-6 sm:mt-10">
                <p className="text-[#BFBFBF] text-xs sm:text-sm font-semibold mb-3">
                  Available on
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    '/assets/icons/sportify.svg',
                    '/assets/icons/Group 1148.svg',
                    '/assets/icons/Group 1149.svg',
                    '/assets/icons/WokpaLogo Landscape 5 2.svg',
                  ].map((src, index) => (
                    <motion.button
                      key={index}
                      variants={iconVariants}
                      whileHover="hover"
                      className="flex-shrink-0"
                    >
                      <Image
                        src={src}
                        alt={`Platform ${index + 1}`}
                        width={src.includes('WokpaLogo') ? 80 : 30}
                        height={src.includes('WokpaLogo') ? 80 : 30}
                        draggable="false"
                        className="w-8 sm:w-[30px] h-8 sm:h-[30px] object-contain"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <motion.button
            onClick={() => handleShare(podcast.title, window.location.href)}
            className="absolute top-4 right-4 flex-shrink-0"
            aria-label={`Share ${podcast.title}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src="/assets/icons/Group 1156.svg"
              alt="Share podcast"
              width={24}
              height={24}
              draggable="false"
              className="w-5 sm:w-6 h-5 sm:h-6"
            />
          </motion.button>
        </motion.div>
      )}

      {!isPodcastLoading && podcast && (
        <div className="flex flex-col md:flex-row gap-6 px-4 sm:px-6 md:px-10 py-12 max-w-7xl mx-auto">
          {/* Episodes Section */}
          <div className="flex-1 min-w-0">
            <div>
              <h2 className="text-sm font-bold mb-6 text-gray-900">
                ALL EPISODES{' '}
                <span className="text-[#5A5A5A]">({episodes?.length || 0} AVAILABLE)</span>
              </h2>
              <Divider className="bg-[#DCDCDC]" />
            </div>
            {isEpisodesLoading ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex gap-4"
                    >
                      <div className="w-[157px] h-[129px] bg-gray-300 animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : isEpisodesError || !episodes || episodes.length === 0 ? (
              <p className="text-gray-500 italic">No episodes available yet.</p>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {episodes.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    variants={cardVariants}
                    custom={index}
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 relative"
                    data-testid="episode-card"
                  >
             
                    <motion.button
                      onClick={() => handleShare(episode.title, episode.content_url)}
                      className="absolute top-4 right-4 flex-shrink-0"
                      aria-label={`Share ${episode.title}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Image
                        src="/assets/icons/Group 1156.svg"
                        alt="Share episode"
                        width={24}
                        height={24}
                        draggable="false"
                        className="w-5 sm:w-6 h-5 sm:h-6"
                      />
                    </motion.button>
                    <div className="min-w-[157px]">
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
                      <div className="flex gap-3 sm:gap-5 text-xs text-[#828282] mb-2">
                        <p>{formatDate(episode.published_at)}</p>
                        <p>{formatDuration(episode.duration)}</p>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold lg:w-[562px] mb-3">
                        {episode.title}
                      </h3>
                      <p className="text-xs sm:text-sm mb-2 leading-relaxed lg:w-[562px]">
                        {cleanDescription(episode.description)}
                      </p>
                      <div className="flex gap-3 mt-3">
                        <motion.button
                          onClick={() => window.open(episode.content_url, '_blank')}
                          className="flex-shrink-0"
                          aria-label={`Play ${episode.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src="/assets/icons/Others.svg"
                            alt="Play episode"
                            width={30}
                            height={30}
                            draggable="false"
                            className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                          />
                        </motion.button>
                        <motion.button
                          onClick={() => handleCopy(episode.content_url)}
                          className="flex-shrink-0"
                          aria-label={`Copy link for ${episode.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src="/assets/icons/Group 1167.svg"
                            alt="Copy link"
                            width={30}
                            height={30}
                            draggable="false"
                            className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                          />
                        </motion.button>
                        <motion.button
                          onClick={() => handleShare(episode.title, episode.content_url)}
                          className="flex-shrink-0"
                          aria-label={`Share ${episode.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src="/assets/icons/Group 1156.svg"
                            alt="Share episode"
                            width={30}
                            height={30}
                            draggable="false"
                            className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                          />
                        </motion.button>
                        <motion.button
                          onClick={handleGift}
                          className="flex-shrink-0"
                          aria-label={`Gift ${episode.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Image
                            src="/assets/icons/Group 1157.svg"
                            alt="Gift episode"
                            width={30}
                            height={30}
                            draggable="false"
                            className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Advertisement Section */}
          <div className="w-full md:w-[344px] flex-shrink-0 di">
            <p className="text-[#5A5A5A] text-[0.70rem] text-right font-semibold mb-1">
              ADVERTISEMENT
            </p>
            <div className="space-y-5">
              <Image
                src="/assets/images/Rectangle 53.svg"
                alt="Advertisement"
                width={344}
                height={489}
                className="w-full max-w-[344px] h-auto object-cover"
                draggable="false"
              />
              <Image
                src="/assets/images/Rectangle 55.svg"
                alt="Advertisement"
                width={344}
                height={489}
                className="w-full max-w-[344px] h-auto object-cover"
                draggable="false"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PodcastDetails;