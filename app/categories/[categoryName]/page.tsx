"use client";

import CategoryPage from "@/components/category/CategoryPage";
import HeroBanner from "@/components/landing-page/HeroBanner";
import Layout from "@/components/layout/Layout";

export default function PodcastDetailPage() {
  return (
    <Layout>
      <HeroBanner />
      <div className="ppx-5 lg:px-10">
        <CategoryPage />
      </div>
    </Layout>
  );
}
