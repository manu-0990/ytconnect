import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  items: string[];
  defaultName: string;
  selectedItem: string;
  onChange: (selectedItem: string) => void;
}

export default function Dropdown({ items, defaultName, selectedItem, onChange }: DropdownProps) {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle selecting an item
  const handleItemClick = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Button that toggles the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-48 justify-between rounded-md bg-white/5 px-4 py-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        {selectedItem}
        <svg
          className="h-5 w-5 ml-2 text-gray-300"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 7l3-3 3 3m-6 6l3 3 3-3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu positioned to open upwards */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 w-48 origin-bottom-right divide-y divide-gray-600 rounded-md bg-white/5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleItemClick(item)}
              className="cursor-pointer select-none px-4 py-2 text-sm text- -200 hover:bg-gray-700 hover:text-white"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
