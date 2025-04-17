'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Animation variants
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const logoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: { scale: 1.05, filter: 'grayscale(0%)', transition: { duration: 0.3 } }, 
};

const Partners: React.FC = () => {
  const logos = [
    {
      src: '/assets/images/Group 1337.svg',
      alt: 'Partner Logo 1',
    },
    {
      src: '/assets/images/Group 1338.svg',
      alt: 'Partner Logo 2',
    },
    {
      src: '/assets/images/Group 1339.svg',
      alt: 'Partner Logo 3',
    },
  ];

  return (
    <section className='px-4 py-10 bg-white text-center'>
      <motion.h3
        className='text-2xl sm:text-3xl font-semibold mb-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={titleVariants}
      >
        OUR GLOBAL PARTNERS
      </motion.h3>
      <div className='flex flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto'>
        {logos.map((logo, index) => (
          <motion.div
            key={logo.src}
            className=' flex items-center justify-center'
            custom={index}
            initial='hidden'
            whileInView='visible'
            whileHover='hover'
            viewport={{ once: true }}
            variants={logoVariants}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={64}
              className='w-full h-auto object-contain grayscale' 
              draggable='false'
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Partners;