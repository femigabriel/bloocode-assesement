'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input, Button } from 'antd';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
};

export const NewsLetter = () => {
  return (
    <section className='bg-[#F6E8E8] px-4 sm:px-10 lg:px-20 py-10'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:gap-8 max-w-7xl mx-auto'>
        <motion.div
          className='lg:w-1/2 lg:mt-10' 
          whileInView='visible'
          viewport={{ once: true }}
          variants={textVariants}
        >
          <div className='mb-5 max-w-md'>
            <h3 className='text-2xl sm:text-3xl font-bold leading-tight'>
              Never stop listening!
            </h3>
            <p className='text-lg sm:text-xl mt-2'>
              Every episode is a journey you don’t want to miss out on.
            </p>
          </div>
          <div className='max-w-md'>
            <p className='text-base text-gray-600'>
              Get the latest headlines and unique ABR stories, sent every weekday.
            </p>
            <motion.div
              className='flex flex-col sm:flex-row gap-3 mt-4'
              variants={inputVariants}
            >
              <Input
                placeholder='Enter your email'
                className='h-12 rounded bg-[#D9D9D9] text-base'
                aria-label='Email address'
              />
              <Button
                type='primary'
                className='h-12 bg-[#CC0001] text-white font-semibold rounded'
              >
                Subscribe
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className='lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0'
          initial='hidden'
          whileInView='visible'
          whileHover='hover'
          viewport={{ once: true }}
          variants={imageVariants}
        >
          <Image
            src='/assets/images/Group 1497.svg'
            alt='Newsletter illustration'
            width={470}
            height={250}
            className='w-full max-w-[470px] h-auto object-cover'
            draggable='false'
          />
        </motion.div>
      </div>
    </section>
  );
};

export default NewsLetter;