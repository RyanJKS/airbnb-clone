'use client';
import { useState } from 'react';
import Categories from './components/Categories';
import PropertyList from './components/properties/PropertyList';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? '' : category);
  };

  return (
    <main className="max-w-[1500px] mx-auto px-6">
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <PropertyList />
      </div>
    </main>
  );
}
