import React from "react";
import Image from "next/image";

const HeroBanner: React.FC = () => (
  <section className="py-3 px-4 ">
    <Image
      src="/assets/images/Group 1086.svg"
      alt="hero"
      width={800}
      height={300}
      className="mx-auto object-cover"
    />
  </section>
);

export default HeroBanner;
