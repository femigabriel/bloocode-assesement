'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Select } from 'antd';

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

const categoryGroups: { name: string; category_types: string[] }[] = [
  {
    name: 'News & Storytelling',
    category_types: ['NEWS', 'SOCIETY & CULTURE'],
  },
  { name: 'Educational', category_types: ['EDUCATION'] },
  {
    name: 'Entertainment & Lifestyle',
    category_types: ['LEISURE', 'ARTS', 'KIDS & FAMILY'],
  },
  {
    name: 'Tech, Sport & Business',
    category_types: ['TECHNOLOGY', 'SPORTS', 'BUSINESS'],
  },
  {
    name: 'Other Podcasts',
    category_types: [
      'RELIGION & SPIRITUALITY',
      'GOVERNMENT',
      'HEALTH & FITNESS',
      'HISTORY',
    ],
  },
];

const formatCategoryType = (type: string): string => {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CategoryPage: React.FC = () => {
  const params = useParams();
  const categoryName = decodeURIComponent((params.categoryName as string).replace(/-/g, ' & '));

  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const {
    data: podcasts,
    isLoading,
    isError,
    error,
  } = useQuery<Podcast[], Error>({
    queryKey: ['topPodcasts', categoryName],
    queryFn: fetchPodcasts,
    retry: 3,
  });

  const currentCategory = categoryGroups.find((group) => group.name === categoryName);
  const otherCategories = categoryGroups
    .filter((group) => group.name !== categoryName)
    .map((group) => ({
      ...group,
      podcasts:
        podcasts?.filter((podcast) => group.category_types.includes(podcast.category_type)) || [],
    }));

  let categoryPodcasts = podcasts?.filter((podcast) =>
    currentCategory?.category_types.includes(podcast.category_type)
  ) || [];

  if (categoryFilter !== 'All') {
    categoryPodcasts = categoryPodcasts.filter(
      (podcast) => podcast.category_type === categoryFilter
    );
  }

  if (sortBy === 'recent') {
    categoryPodcasts = [...categoryPodcasts].reverse(); 
  }

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto">
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold text-[#5A5A5A] border-l-[3px] border-[#CC0001] pl-2 mb-4"
      >
        {categoryName}
      </motion.h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium text-[#5A5A5A] mr-2">Sort by:</label>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              style={{ width: 120 }}
              options={[
                { value: 'popular', label: 'Popular' },
                { value: 'recent', label: 'Recent' },
              ]}
              className="text-sm text-[#9747FF] border-[#9747FF]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5A5A5A] mr-2">Sort by category:</label>
            <Select
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              style={{ width: 180 }}
              options={[
                { value: 'All', label: 'All' },
                ...(currentCategory?.category_types.map((type) => ({
                  value: type,
                  label: formatCategoryType(type),
                })) || []),
              ]}
              className="text-sm text-[#9747FF] border-[#9747FF]"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-md overflow-hidden shadow-sm w-60"
              >
                <div className="w-full h-40 bg-gray-300 animate-pulse" />
                <div className="p-3">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                </div>
              </div>
            ))}
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">
          Error fetching podcasts: {error?.message || 'Unknown error'}
        </p>
      ) : !categoryPodcasts || categoryPodcasts.length === 0 ? (
        <p className="text-gray-500 text-center">No podcasts available in this category.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categoryPodcasts.map((podcast, index) => (
            <Link href={`/podcast/${podcast.id}`} key={podcast.id} passHref>
              <motion.div
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                className="bg-[#F4F4F4] rounded-md overflow-hidden shadow-sm w-60"
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
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Button 1 clicked for podcast:', podcast.id);
                      }}
                    >
                      <Image
                        src="/assets/icons/Group 1289.svg"
                        alt="icon"
                        width={20}
                        height={20}
                        draggable="false"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Button 2 clicked for podcast:', podcast.id);
                      }}
                    >
                      <Image
                        src="/assets/icons/Group 1293.svg"
                        alt="icon"
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
      )}

      <div className="mt-10">
        <h3 className="text-sm font-bold mb-4">OTHER CATEGORIES</h3>
        <div className="border-b-2 border-[#DCDCDC] mb-4" />
        {isLoading ? (
          <div className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-[#ffff] rounded-md shadow-sm flex-none w-60 snap-start"
                >
                  <div className="w-full h-40 bg-gray-300 animate-pulse" />
                  <div className="p-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory"
          >
            {otherCategories.map((category, index) => (
              <Link
                href={`/categories/${encodeURIComponent(category.name.replace(/ & /g, '-'))}`}
                key={category.name}
                passHref
              >
                <motion.div
                  variants={cardVariants}
                  custom={index}
                  whileHover="hover"
                  className="bg-[#ffff] rounded-md overflow-hidden shadow-sm flex-none w-60 snap-start"
                >
                  <Image
                    src={category.podcasts[0]?.picture_url || '/assets/images/fallback.jpg'}
                    alt={category.name}
                    width={240}
                    height={160}
                    className="w-full h-40 object-cover"
                    unoptimized
                  />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm truncate">{category.name}</h4>
                    <div className="mt-3 flex gap-3 items-center">
                      <span className="text-[#BEBEBE] text-xs">Explore Category</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Button 1 clicked for category:', category.name);
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
                          console.log('Button 2 clicked for category:', category.name);
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
        )}
      </div>
    </section>
  );
};

export default CategoryPage;