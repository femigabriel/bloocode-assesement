'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

// Podcast interface matching API response
interface Podcast {
  id: number;
  title: string;
  picture_url: string;
  author: string;
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: { scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fetchTrendingEpisodes = async (): Promise<Podcast[]> => {
  try {
    const { data } = await axios.get('https://api.wokpa.app/api/listeners/top-podcasts?page=1&per_page=15');
    console.log('API Response:', data); // Debug the response
    return Array.isArray(data?.data?.data) ? data.data.data : [];
  } catch (error) {
    console.error('Error fetching trending episodes:', error);
    throw new Error('Failed to fetch trending episodes');
  }
};

const TrendingEpisodes: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<Podcast[], Error>({
    queryKey: ['trendingEpisodes'],
    queryFn: fetchTrendingEpisodes,
    retry: 3,
  });

  console.log('Data in component:', data); // Debug the data

  return (
    <section className='px-4 py-8'>
      <div className='mb-4'>
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-2xl font-semibold mb-4'
        >
          Trending this week
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2'
        >
          Featured Podcasts
        </motion.p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='bg-gray-100 rounded-md overflow-hidden shadow-sm'>
                <div className='w-full h-40 bg-gray-300 animate-pulse' />
                <div className='p-3'>
                  <div className='h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse' />
                  <div className='h-4 bg-gray-300 rounded w-1/2 animate-pulse' />
                </div>
              </div>
            ))}
        </div>
      ) : isError ? (
        <p className='text-red-500 text-center'>Error fetching episodes: {error?.message || 'Unknown error'}</p>
      ) : !data || data.length === 0 ? (
        <p className='text-gray-500 text-center'>No trending episodes available.</p>
      ) : (
        <motion.div
          variants={gridVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
        >
          {data.map((episode, index) => (
            <motion.div
              key={episode.id}
              variants={cardVariants}
              custom={index}
              whileHover='hover'
              className='bg-gray-100 rounded-md overflow-hidden shadow-sm'
            >
              <Image
                src={episode.picture_url || '/assets/images/fallback.jpg'} // Fallback image
                alt={episode.title}
                width={300}
                height={160}
                className='w-full h-40 object-cover'
                unoptimized // Use if image optimization is not needed
              />
              <div className='p-3'>
                <h4 className='font-semibold text-md truncate'>{episode.title}</h4>
                <p className='text-sm text-gray-500'>{episode.author}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default TrendingEpisodes;