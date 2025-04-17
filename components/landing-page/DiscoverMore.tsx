import React from 'react';

const DiscoverMore: React.FC = () => (
  <section className="px-4 py-8">
    <h3 className="text-2xl font-semibold mb-4">Discover More</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-gray-100 h-36 rounded-md"></div>
      ))}
    </div>
  </section>
);

export default DiscoverMore;