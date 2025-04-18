'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

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
  title: string;
  description: string;
  duration: string; // e.g., "30:15"
  release_date: string; // e.g., "2024-10-04"
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
};

const fetchPodcastDetails = async (id: string): Promise<Podcast> => {
  try {
    const { data } = await axios.get(`https://api.wokpa.app/api/listeners/podcasts/${id}`);
    console.log('Podcast Response:', data); // Debug log
    return data?.data || {};
  } catch (error: any) {
    console.error('Podcast Fetch Error:', error.response?.status, error.message, error.response?.data);
    throw new Error('Failed to fetch podcast details');
  }
};

// Mock episodes fetch until real endpoint is provided
const fetchPodcastEpisodes = async (_id: string): Promise<Episode[]> => {
  // Replace with real endpoint, e.g.:
  // const { data } = await axios.get(`https://api.wokpa.app/api/listeners/podcasts/${id}/episodes?page=1&per_page=20`);
  // return Array.isArray(data?.data?.data) ? data.data.data : [];
  return [
    {
      id: 1,
      title: 'Episode 1: Introduction',
      description: 'An introduction to the podcast series.',
      duration: '30:15',
      release_date: '2024-06-18',
    },
    {
      id: 2,
      title: 'Episode 2: Community Issues',
      description: 'Discussing key challenges in the community.',
      duration: '45:00',
      release_date: '2024-07-01',
    },
    {
      id: 3,
      title: 'Episode 3: Moving Forward',
      description: 'Solutions and next steps for change.',
      duration: '38:20',
      release_date: '2024-07-15',
    },
  ];
};

const PodcastDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  console.log('Podcast ID:', id); // Debug log

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
    error: episodesError,
  } = useQuery<Episode[], Error>({
    queryKey: ['podcastEpisodes', id],
    queryFn: () => fetchPodcastEpisodes(id),
    retry: 3,
  });

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10 max-w-6xl mx-auto">
      {/* Top Section: Podcast Profile */}
      {isPodcastLoading ? (
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          <div className="w-full md:w-[400px] h-[400px] bg-gray-300 animate-pulse rounded-2xl" />
          <div className="w-full md:flex-1 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
          </div>
        </div>
      ) : isPodcastError ? (
        <div className="text-center mb-12">
          <p className="text-red-500 mb-4">
            Unable to load podcast details: {podcastError?.message || 'Unknown error'}
          </p>
          <Link href="/" className="text-[#CC0001] hover:text-[#A30001] font-medium">
            Back to Home
          </Link>
        </div>
      ) : !podcast ? (
        <div className="text-center mb-12">
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
          className="flex flex-col md:flex-row gap-10 mb-12"
        >
          <Image
            src={podcast.picture_url || '/assets/images/fallback.jpg'}
            alt={podcast.title}
            width={400}
            height={400}
            className="w-full md:w-[400px] h-[400px] object-cover rounded-2xl shadow-md"
            unoptimized
          />
          <div className="w-full md:flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{podcast.title}</h1>
            <p className="text-lg font-medium text-gray-600 mb-1">By {podcast.author}</p>
            <p className="text-sm font-medium text-[#CC0001] mb-4 uppercase">{podcast.category_name}</p>
            <p className="text-base text-gray-700 leading-relaxed mb-6">{podcast.description}</p>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
              {podcast.publisher.profile_image_url && (
                <Image
                  src={podcast.publisher.profile_image_url}
                  alt={`${podcast.publisher.first_name}'s profile`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{podcast.publisher.company_name}</p>
                <p>
                  {podcast.publisher.first_name} {podcast.publisher.last_name}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Episodes Section */}
      {!isPodcastLoading && podcast && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            ALL EPISODES ({episodes?.length || 3} AVAILABLE)
          </h2>
          {isEpisodesLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
                </div>
              ))}
            </div>
          ) : isEpisodesError ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">
                Unable to load episodes: {episodesError?.message || 'Unknown error'}
              </p>
            </div>
          ) : !episodes || episodes.length === 0 ? (
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
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{episode.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{episode.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{episode.duration}</span>
                    <span>{new Date(episode.release_date).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
};

export default PodcastDetailPage;