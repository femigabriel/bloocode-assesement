import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from './HeroBanner';
import FeaturedPicks from './FeaturedPicks';
import TopPodcasts from './TopPodcasts';
import TrendingEpisodes from './TrendingEpisodes';
import NewAndNoteworthy from './NewAndNoteworthy';
import Suggestions from './Suggestions';
import DiscoverMore from './DiscoverMore';
import NewsletterCTA from './NewsletterCTA';
import Partners from './Partners';


export const LandingPage = () => {
  return (
    <Layout>
      <HeroBanner />
      <div className="container mx-auto px-4 py-8 space-y-16">
        <FeaturedPicks />
        <TopPodcasts />
        <TrendingEpisodes />
        <NewAndNoteworthy />
        <Suggestions />
        <DiscoverMore />
        <NewsletterCTA />
        <Partners />
      </div>
    </Layout>
  );
};

export default LandingPage;