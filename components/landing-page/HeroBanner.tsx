import React from "react";
import Image from "next/image";

const HeroBanner = () => (
  <section>
    <div className="flex h-[72px] w-full">
      {/* Left image - hide on small screens */}
      <div className="hidden md:block h-full max-w-[588px]">
        <Image
          src="/assets/images/Group 974.svg"
          alt="hero"
          width={608}
          height={72}
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>

      {/* Right content */}
      <div className="flex-1 bg-[#1B1B1B] h-full overflow-hidden">
        <div className="w-full h-full flex items-center">
          <nav className="flex gap-12 animate-marquee whitespace-nowrap text-white text-sm px-6">
            <li className="flex items-center gap-2 list-none">
              <Image
                src="/assets/icons/book-alt 1.svg"
                alt="icon"
                width={18}
                height={18}
                draggable="false"
              />
              <span>Latest News</span>
            </li>
            <li className="flex items-center gap-2 list-none">
              <Image
                src="/assets/icons/microphone-alt 1.svg"
                alt="icon"
                width={18}
                height={18}
                draggable="false"
              />
              <span>New Episodes</span>
            </li>
            <li className="flex items-center gap-2 list-none">
              <Image
                src="/assets/icons/boxes 1.svg"
                alt="icon"
                width={18}
                height={18}
                draggable="false"
              />
              <span>Our Services</span>
            </li>
            <li className="flex items-center gap-2 list-none">
              <Image
                src="/assets/icons/podcast (1) 1.svg"
                alt="icon"
                width={18}
                height={18}
                draggable="false"
              />
              <span>All Podcasts</span>
            </li>
          </nav>
        </div>
      </div>
    </div>

    {/* Hero content image below */}
    <div className="py-4 px-4">
      <Image
        src="/assets/images/Group 1086.svg"
        alt="hero content"
        width={800}
        height={300}
        className="mx-auto w-full max-w-[800px] object-cover"
        draggable="false"
      />
    </div>
  </section>
);

export default HeroBanner;
