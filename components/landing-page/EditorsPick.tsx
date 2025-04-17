import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants for reusability
const imageVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const miniCardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.2, ease: "easeOut" },
  }),
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

// Parent container variant for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const EditorsPick = () => {
  return (
    <section className="px-4 py-8">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold">EDITOR’S PICKS</h3>
        <p className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2">
          Featured Episodes
        </p>
      </div>

      <div className="py-4 flex flex-col md:flex-row gap-6 w-full h-full">
        {/* LEFT FEATURED IMAGE */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1"
        >
          <Image
            src="/assets/images/Group 1496 (1).svg"
            alt="hero content"
            width={800}
            height={300}
            className="mx-auto w-full max-w-[670px] h-full object-cover"
            draggable="false"
          />
        </motion.div>

        {/* RIGHT MINI CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-4 w-full max-w-[650px]"
        >
          {/* Top Two Cards Side by Side */}
          <div className="flex gap-4">
            {/* Card 1 */}
            <motion.div
              variants={miniCardVariants}
              custom={0}
              whileHover="hover"
              className="w-1/2"
            >
              <Image
                src="/assets/images/Group 1090.svg"
                alt="future"
                width={300}
                height={150}
                className="object-cover w-full"
              />
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={miniCardVariants}
              custom={1}
              whileHover="hover"
              className="w-1/2"
            >
              <Image
                src="/assets/images/Group 1091.svg"
                alt="compatibility"
                width={300}
                height={150}
                className="object-cover w-full"
              />
            </motion.div>
          </div>

          {/* Bottom Single Card */}
          <motion.div
            variants={miniCardVariants}
            custom={2}
            whileHover="hover"
            className="w-full"
          >
            <Image
              src="/assets/images/Group 1089.svg"
              alt="bottom card"
              width={600}
              height={150}
              className="object-cover w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};