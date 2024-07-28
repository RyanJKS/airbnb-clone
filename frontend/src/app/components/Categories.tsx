'use client';
import React, { useRef } from 'react';
import { GiRoundStar, GiCampingTent } from "react-icons/gi";
import { MdCabin, MdOutlinePool } from "react-icons/md";
import { FaUmbrellaBeach } from "react-icons/fa";

interface CategoriesProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
    const categories = [
        { id: "icons", icon: GiRoundStar, label: "Icons" },
        { id: "cabins", icon: MdCabin, label: "Cabins" },
        { id: "beachfront", icon: FaUmbrellaBeach, label: "Beachfront" },
        { id: "pools", icon: MdOutlinePool, label: "Amazing Pools" },
        { id: "camping", icon: GiCampingTent, label: "Camping" },
    ];

    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            const newPosition = direction === 'left'
                ? containerRef.current.scrollLeft - scrollAmount
                : containerRef.current.scrollLeft + scrollAmount;

            containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 p-2 z-8 bg-white border rounded-full shadow-md"
            >
                &lt;
            </button>
            <div
                ref={containerRef}
                className="flex overflow-hidden space-x-9 pl-10 pr-10 py-4"
                style={{ scrollBehavior: 'smooth' }}
            >
                {categories.map(category => {
                    const IconComponent = category.icon;
                    return (
                        <div
                            key={category.id}
                            className={`pb-4 flex flex-col items-center space-y-2 border-b-2 cursor-pointer ${selectedCategory === category.id ? 'border-red-500 opacity-100' : 'border-white opacity-60'} hover:opacity-100 hover:border-gray-200`}
                            onClick={() => onSelectCategory(category.id)}
                        >
                            <IconComponent className={`text-2xl ${selectedCategory === category.id ? 'text-red-500' : 'text-black'}`} />
                            <span className="text-xs">{category.label}</span>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 p-2 z-8 bg-white border rounded-full shadow-md"
            >
                &gt;
            </button>
        </div>
    );
};

export default Categories;
