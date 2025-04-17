import React from "react";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-inhert">
      <div className="text-center">


        {/* Title */}
        <h1 className="text-2xl font-extrabold text-gray-800">
          Oops! You're Lost
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl text-gray-600">
          We can't seem to find the page you're looking for.
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className="mt-6 inline-block px-8 py-3 text-lg font-semibold text-[#EBEBF5] bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
