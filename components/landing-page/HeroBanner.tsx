import React from 'react';
import Image from 'next/image';

const HeroBanner: React.FC = () => (
  <section className="bg-[#e6f2ff] py-10 px-4 text-center">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Everyday Transaction</h2>
      <p className="mb-6 text-gray-600">Enjoy top podcasts tailored to your taste</p>
      <Image src="/images/hero.png" alt="hero" width={800} height={300} className="mx-auto rounded-lg" />
    </div>
  </section>
);

export default HeroBanner;
