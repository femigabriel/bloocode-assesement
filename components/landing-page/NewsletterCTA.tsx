import React from 'react';
import { Input, Button } from 'antd';

const NewsletterCTA: React.FC = () => (
  <section className="px-4 py-10 bg-blue-50 text-center">
    <div className="max-w-xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Never Miss an Update</h3>
      <p className="mb-4 text-gray-600">Subscribe to get the latest episodes and news</p>
      <div className="flex gap-2 justify-center">
        <Input placeholder="Enter your email" className="w-2/3" />
        <Button type="primary">Subscribe</Button>
      </div>
    </div>
  </section>
);

export default NewsletterCTA;