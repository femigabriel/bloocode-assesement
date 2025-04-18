"use client";

import EpisodeDetails from "@/components/episode/EpisodeDetails";
import HeroBanner from "@/components/landing-page/HeroBanner";
import NewsLetter from "@/components/landing-page/NewsLetter";
import Layout from "@/components/layout/Layout";

export default function PodcastDetailsPage() {
  return (
    <Layout>
      <HeroBanner />
      <div className="">
        <EpisodeDetails />
        <NewsLetter />
      </div>
    </Layout>
  );
}
