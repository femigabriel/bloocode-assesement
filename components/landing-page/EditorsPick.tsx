"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";

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
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

export const EditorsPick = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);

        const pages = [1, 2];
        const results = await Promise.all(
          pages.map((page) =>
            axios.get(
              `https://api.wokpa.app/api/listeners/top-podcasts?page=${page}&per_page=50`
            )
          )
        );

        const allPodcasts: Podcast[] = results.flatMap((res) =>
          Array.isArray(res.data?.data?.data)
            ? res.data.data.data.filter((p: Podcast) => p.picture_url)
            : []
        );

        if (allPodcasts.length === 0) {
          throw new Error("No valid podcasts found");
        }

        let attempts = 0;
        let foundEpisodes: Episode[] = [];

        while (attempts < 3 && foundEpisodes.length < 3) {
          const randomPodcast =
            allPodcasts[Math.floor(Math.random() * allPodcasts.length)];
          try {
            const episodeRes = await axios.get(
              `https://api.wokpa.app/api/listeners/podcasts/${randomPodcast.id}/episodes?page=1&per_page=20`
            );

            const allEpisodes: Episode[] = (
              episodeRes.data?.data?.data || []
            ).filter((ep: Episode) => ep.picture_url && ep.title);

            if (allEpisodes.length >= 3) {
              foundEpisodes = [...allEpisodes]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            }
          } catch (e) {
            console.warn(
              `Failed to fetch episodes for podcast ${randomPodcast.id}`
            );
          }
          attempts++;
        }

        if (foundEpisodes.length < 3) {
          throw new Error("Couldn't find enough valid episodes");
        }

        setEpisodes(foundEpisodes);
      } catch (error) {
        console.error("Error fetching episodes:", error);
        setError("Failed to load editor's picks. Please try again later.");
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomEpisodes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || episodes.length < 3) {
    return (
      <section className="px-4 py-10 bg-[#F6F6F6]">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">EDITOR'S PICKS</h3>
          <p className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2">
            Featured Episodes
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-500">
            {error || "No featured episodes available at the moment"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 bg-[#F6F6F6]">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">EDITOR'S PICKS</h3>
        <p className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2">
          Featured Episodes
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 flex">
          <Link
            href={`/episode/${episodes[0].id}?podcastId=${episodes[0].podcast_id}`}
            passHref
            className="flex-1 relative rounded-xl overflow-hidden min-h-[300px]"
          >
            <motion.div
              className="w-full h-full"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              whileHover="hover"
            >
              <div className="relative w-full h-full">
                <Image
                  src={episodes[0].picture_url}
                  alt={episodes[0].title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/fallback.jpg";
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full bg-[#00000080] px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <button>
                      <Image
                        src="/assets/icons/Others.svg"
                        alt="Play episode"
                        width={36}
                        height={36}
                        draggable="false"
                        className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                      />
                    </button>
                    <h4 className="text-lg font-semibold line-clamp-2">
                      {episodes[0].title}
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex">
          <motion.div
            className="flex-1 flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex gap-4 flex-1">
              {[episodes[1], episodes[2]].map((ep, index) => (
                <Link
                  href={`/episode/${ep.id}?podcastId=${ep.podcast_id}`}
                  key={ep.id}
                  passHref
                  className="flex-1"
                >
                  <motion.div
                    className="h-full"
                    variants={cardVariants}
                    custom={index + 1}
                    whileHover="hover"
                  >
                    <Card
                      hoverable
                      className="h-full  flex flex-col"
                      bodyStyle={{ flex: 1 }}
                      cover={
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={ep.picture_url}
                            alt={ep.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/assets/images/fallback.jpg";
                            }}
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <h4 className="text-sm font-semibold line-clamp-2">
                            {ep.title}
                          </h4>
                        }
                        description={
                          <div className="flex justify-between items-center mt-2">
                            <button>
                              <Image
                                src="/assets/icons/Others.svg"
                                alt="Play episode"
                                width={24}
                                height={24}
                                className="w-6 sm:w-[30px] h-6 sm:h-[30px]"
                              />
                            </button>
                            <p className="text-gray-500 text-xs">
                              {new Date(ep.published_at).toLocaleDateString()} •{" "}
                              {Math.round(ep.duration / 60)} mins
                            </p>
                          </div>
                        }
                      />
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>

            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Image
                src="/assets/images/Group 1089.svg"
                alt="bottom illustration"
                width={600}
                height={150}
                className="object-cover w-full rounded-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EditorsPick;
