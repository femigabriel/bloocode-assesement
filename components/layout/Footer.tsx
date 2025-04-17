import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-black text-white py-8 px-4 text-center">
    <div className="max-w-6xl mx-auto">
      <p>&copy; {new Date().getFullYear()} Bloocode. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;