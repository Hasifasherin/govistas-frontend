"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const HeroSearch = () => {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    router.push(
      `/tours?destination=${destination}&category=${category}&date=${date}`
    );
  };

  return (
    <div className="bg-white rounded-full shadow-xl flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto overflow-hidden">
      {/* Destination Input */}
      <input
        type="text"
        placeholder="Where to?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="flex-1 px-6 py-4 text-gray-700 outline-none text-sm md:text-base placeholder-gray-400 rounded-l-full md:rounded-l-full"
      />

      {/* Category Select */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 px-4 py-4 text-gray-700 outline-none text-sm md:text-base border-t md:border-t-0 md:border-l border-gray-200"
      >
        <option value="">All Categories</option>
        <option value="adventure">Adventure</option>
        <option value="culture">Culture</option>
        <option value="family">Family</option>
        <option value="romantic">Romantic</option>
      </select>

      {/* Date Picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 px-4 py-4 text-gray-700 outline-none text-sm md:text-base border-t md:border-t-0 md:border-l border-gray-200"
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white flex items-center justify-center px-6 py-4 rounded-r-full md:rounded-r-full"
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSearch;
