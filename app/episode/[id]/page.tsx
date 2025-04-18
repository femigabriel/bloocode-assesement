"use client";

import EpisodeDetails from "@/components/episode/EpisodeDetails";
import HeroBanner from "@/components/landing-page/HeroBanner";
import Layout from "@/components/layout/Layout";

export default function PodcastDetailsPage() {
  return (
    <Layout>
      <HeroBanner />
      <div className="">
        <EpisodeDetails />
      </div>
    </Layout>
  );
}
