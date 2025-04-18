import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from './HeroBanner';
import FeaturedPicks from './FeaturedPicks';
import Partners from './Partners';
import { EditorsPick } from './EditorsPick';
import ListenByCategories from './ListenByCategories';
import { NewsLetter } from './NewsLetter';
import TrendingPodcasts from './TrendingPodcasts';


export const LandingPage = () => {
  return (
    <Layout>
      <HeroBanner />
      <div className="container mx-auto px-4 py-8 space-y-16">
        <EditorsPick />
        <TrendingPodcasts />
        <FeaturedPicks />
        <ListenByCategories />
        <NewsLetter />
        <Partners />
  
      </div>
    </Layout>
  );
};

export default LandingPage;