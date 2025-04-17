import React from 'react';

const Partners: React.FC = () => (
  <section className="px-4 py-10 bg-white text-center">
    <h3 className="text-2xl font-semibold mb-6">Our Partners</h3>
    <div className="flex flex-wrap justify-center gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 w-32 h-16 rounded-md"></div>
      ))}
    </div>
  </section>
);

export default Partners;