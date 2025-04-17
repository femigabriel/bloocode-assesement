'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const logoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const navVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: { scale: 1.1, transition: { duration: 0.3 } }, 
};

const Footer = () => {
  const socialLinks = [
    { src: '/assets/icons/ig.svg', url: 'https://instagram.com/', alt: 'Instagram', label: 'Instagram' },
    { src: '/assets/icons/fb.svg', url: 'https://facebook.com/', alt: 'Facebook', label: 'Facebook' },
    { src: '/assets/icons/x.svg', url: 'https://x.com/', alt: 'X', label: 'X' },
    { src: '/assets/icons/linkedIn.svg', url: 'https://linkedin.com/', alt: 'LinkedIn', label: 'LinkedIn' },
  ];

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/podcasts', label: 'All Podcasts' },
    { href: '/advertise', label: 'Advertise' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <footer className='bg-[#282828] text-white py-8 px-4 sm:px-8 lg:px-16'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={logoVariants}
        >
          <Link href='/'>
            <Image
              src='/assets/images/ABR Logo 2.svg'
              alt='Africa Business Radio Logo'
              width={108}
              height={40}
              className='w-[80px] md:w-[108px] h-auto'
              draggable='false'
            />
          </Link>
        </motion.div>

        <motion.nav
          className='my-10 flex flex-col md:flex-row md:items-center md:gap-10 text-[#C9C9C9] font-bold text-sm uppercase'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={navVariants}
        >
          <ul className='flex flex-wrap gap-4 sm:gap-6 mb-4 md:mb-0'>
            {navLinks.map((link) => (
              <li
                key={link.href}
                className='relative pr-4 sm:pr-6 border-r border-[#C9C9C9] last:border-r-0 md:last:border-r'
              >
                <Link href={link.href} className='hover:text-[#CC0001] transition-colors'>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className='flex items-center gap-4'>
            <span className='text-[#C9C9C9] font-bold hidden md:inline'>
              Connect with ABR
            </span>
            <div className='flex gap-3'>
              {socialLinks.map(({ src, url, alt, label }, index) => (
                <motion.a
                  key={url}
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  custom={index}
                  initial='hidden'
                  whileInView='visible'
                  whileHover='hover'
                  viewport={{ once: true }}
                  variants={socialVariants}
                  className=''
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={20}
                    height={20}
                    className='h-5 w-5 object-contain'
                    draggable='false'
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.nav>

        <div className='flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-[#C9C9C9]'>
          <p>© Copyright {new Date().getFullYear()} All Rights Reserved.</p>
          <nav className='flex gap-4'>
            <Link href='/terms' className='hover:text-[#CC0001] transition-colors'>
              Terms & Conditions
            </Link>
            <Link href='/privacy' className='hover:text-[#CC0001] transition-colors'>
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;