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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fetchPodcastDetails = async (id: string): Promise<Podcast> => {
  const { data } = await axios.get(
    'https://api.wokpa.app/api/listeners/top-podcasts?page=1&per_page=50'
  );
  const podcasts = Array.isArray(data?.data?.data) ? data.data.data : [];
  const podcast = podcasts.find((p: Podcast) => p.id === Number(id));
  if (!podcast) throw new Error('Podcast not found');
  return podcast;
};

const PodcastDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const {
    data: podcast,
    isLoading,
    isError,
    error,
  } = useQuery<Podcast, Error>({
    queryKey: ['podcast', id],
    queryFn: () => fetchPodcastDetails(id),
    retry: 3,
  });

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="w-full md:w-1/3 h-64 bg-gray-300 animate-pulse rounded-2xl" />
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
          </div>
        </div>
      ) : isError ? (
        <div className="text-center mb-12">
          <p className="text-red-500 mb-4">
            Unable to load podcast details: {error?.message || 'Unknown error'}
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

      {!isLoading && podcast && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <div className="text-gray-500 italic">No episodes available yet.</div>
        </div>
      )}
    </section>
  );
};

export default PodcastDetailPage;
