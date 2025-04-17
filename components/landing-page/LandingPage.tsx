import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from './HeroBanner';
import FeaturedPicks from './FeaturedPicks';
import TrendingEpisodes from './TrendingEpisodes';
import NewAndNoteworthy from './NewAndNoteworthy';
import Suggestions from './Suggestions';
import DiscoverMore from './DiscoverMore';
import NewsletterCTA from './NewsletterCTA';
import Partners from './Partners';
import { EditorsPick } from './EditorsPick';
import ListenByCategories from './ListenByCategories';
import { NewsLetter } from './NewsLetter';


export const LandingPage = () => {
  return (
    <Layout>
      <HeroBanner />
      <div className="container mx-auto px-4 py-8 space-y-16">
        <EditorsPick />
        <TrendingEpisodes />
        <FeaturedPicks />
        <ListenByCategories />
        <NewsLetter />

        
        
        <Suggestions />
        <DiscoverMore />
        <NewsletterCTA />
        <Partners />
      </div>
    </Layout>
  );
};

export default LandingPage;