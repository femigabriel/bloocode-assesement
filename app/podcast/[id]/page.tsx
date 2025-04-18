"use client";

import HeroBanner from "@/components/landing-page/HeroBanner";
import Layout from "@/components/layout/Layout";
import PodcastDetails from "@/components/podcast/PodcastDetails";

export default function PodcastDetailsPage() {
  return (
    <Layout>
      <HeroBanner />
      <div className="">
        <PodcastDetails />
      </div>
    </Layout>
  );
}
