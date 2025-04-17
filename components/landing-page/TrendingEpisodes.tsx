import React from 'react';

const TrendingEpisodes: React.FC = () => (
  <section className="px-4 py-8">
    <h3 className="text-2xl font-semibold mb-4">Trending Episodes</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-100 h-32 rounded-md p-4">Episode {i + 1}</div>
      ))}
    </div>
  </section>
);

export default TrendingEpisodes;