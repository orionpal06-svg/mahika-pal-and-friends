
import React from 'react';

const StethoscopeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h.008v.015h-.008v-.015zm17.25 0h-.008v.015h.008v-.015zm-17.25 0v-2.25A2.25 2.25 0 015.625 15h12.75c1.24 0 2.25.75 2.25 2.25v2.25m-15-9.375c1.036 0 1.875-.84 1.875-1.875v-2.25c0-1.036-.84-1.875-1.875-1.875s-1.875.84-1.875 1.875v2.25c0 1.035.84 1.875 1.875 1.875zM19.5 10.125c1.036 0 1.875-.84 1.875-1.875v-2.25c0-1.036-.84-1.875-1.875-1.875s-1.875.84-1.875 1.875v2.25c0 1.035.84 1.875 1.875 1.875zM12 15V9"
    />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
                <StethoscopeIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Health <span className="text-primary">Guardian AI</span>
                </h1>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
