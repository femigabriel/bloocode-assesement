import React from 'react';

const NewAndNoteworthy: React.FC = () => (
  <section className="px-4 py-8">
    <h3 className="text-2xl font-semibold mb-4">New and Noteworthy</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-gray-100 h-40 rounded-md"></div>
      ))}
    </div>
  </section>
);

export default NewAndNoteworthy;