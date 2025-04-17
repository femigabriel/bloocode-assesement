import React from 'react';
import Image from "next/image";

export const EditorsPick = () => {
  return (
    <section className="px-4 py-8">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold">EDITOR’S PICKS</h3>
        <p className="text-[#5A5A5A] text-sm border-l-[3px] border-[#CC0001] pl-2">
          Featured Episodes
        </p>
      </div>
      <div className="py-4 flex">
      <div className="">
      <Image
        src="/assets/images/Group 1496 (1).svg"
        alt="hero content"
        width={800}
        height={300}
        className="mx-auto w-full max-w-[800px] object-cover"
        draggable="false"
      />
    </div>
      </div>
    </section>
  );
};
