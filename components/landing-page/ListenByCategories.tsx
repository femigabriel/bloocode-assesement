'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Podcast {
  id: number;
  title: string;
  picture_url: string;
  category_type: string;
}

interface CategoryGroup {
  name: string;
  category_types: string[];
  podcasts: Podcast[];
}

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fetchPodcasts = async (): Promise<Podcast[]> => {
  try {
    const { data } = await axios.get(
      'https://api.wokpa.app/api/listeners/top-podcasts?page=1&per_page=50'
    );
    return Array.isArray(data?.data?.data) ? data.data.data : [];
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw new Error('Failed to fetch podcasts');
  }
};

// Define Figma categories and map to API category_types
const categoryGroups: { name: string; category_types: string[] }[] = [
  { name: 'News & Storytelling', category_types: ['NEWS', 'SOCIETY & CULTURE'] },
  { name: 'Educational', category_types: ['EDUCATION'] },
  { name: 'Entertainment & Lifestyle', category_types: ['LEISURE', 'ARTS', 'KIDS & FAMILY'] },
  { name: 'Tech, Sport & Business', category_types: ['TECHNOLOGY', 'SPORTS', 'BUSINESS'] },
  {
    name: 'Other Podcasts',
    category_types: ['RELIGION & SPIRITUALITY', 'GOVERNMENT', 'HEALTH & FITNESS', 'HISTORY'],
  },
];

const ListenByCategories: React.FC = () => {
  const { data: podcasts, isLoading, isError, error } = useQuery<Podcast[], Error>({
    queryKey: ['topPodcasts'],
    queryFn: fetchPodcasts,
    retry: 3,
  });

  // Group podcasts by Figma categories
  const groupedCategories: CategoryGroup[] = categoryGroups.map((group) => ({
    name: group.name,
    category_types: group.category_types,
    podcasts: podcasts?.filter((podcast) => group.category_types.includes(podcast.category_type)) || [],
  }));

  return (
    <section className="px-4 py-8">
      <div className="mb-10">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold bg-[#F0E4FF] px-5 py-5 rounded-sm"
        >
          LISTEN BY ABR CATEGORIES
        </motion.h3>
      </div>

      {isLoading ? (
        <div>
          {categoryGroups.map((group) => (
            <div key={group.name} className="mb-8">
              <h4 className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2 mb-4">
                {group.name}
              </h4>
              <div className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-md overflow-hidden shadow-sm flex-none w-60 snap-start"
                    >
                      <div className="w-full h-40 bg-gray-300 animate-pulse" />
                      <div className="p-3">
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">
          Error fetching podcasts: {error?.message || 'Unknown error'}
        </p>
      ) : !podcasts || podcasts.length === 0 ? (
        <p className="text-gray-500 text-center">No podcasts available.</p>
      ) : (
        <div>
          {groupedCategories.map((group) => (
            <div key={group.name} className="mb-8">
              <motion.h4
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2 mb-4"
              >
                {group.name}
              </motion.h4>
              {group.podcasts.length === 0 ? (
                <p className="text-gray-500">No podcasts available in this category.</p>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex space-x-4 ${
                    group.podcasts.length < 4
                      ? 'justify-center'
                      : 'overflow-x-auto no-scrollbar snap-x snap-mandatory'
                  }`}
                >
                  {group.podcasts.map((podcast, index) => (
                    <motion.div
                      key={podcast.id}
                      variants={cardVariants}
                      custom={index}
                      whileHover="hover"
                      className="bg-gray-100 rounded-md overflow-hidden shadow-sm flex-none w-60 snap-start"
                    >
                      <Image
                        src={podcast.picture_url || '/assets/images/fallback.jpg'}
                        alt={podcast.title}
                        width={240}
                        height={160}
                        className="w-full h-40 object-cover"
                        unoptimized
                      />
                      <div className="p-3">
                        <h5 className="font-semibold text-md truncate">{podcast.title}</h5>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ListenByCategories;