import React from 'react';

const FeaturedPicks: React.FC = () => (
  <section className="px-4 py-8">
    <h3 className="text-2xl font-semibold mb-4">Top Picks</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100 h-48 rounded-md shadow-sm"></div>
      ))}
    </div>
  </section>
);

export default FeaturedPicks;