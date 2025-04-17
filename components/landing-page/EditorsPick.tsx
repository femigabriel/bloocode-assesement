import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
        <div className="flex flex-col gap-4 w-full max-w-[650px]">
          {/* Top Two Cards Side by Side */}
          <div className="flex gap-4">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
        </div>
      </div>
    </section>
  );
};
