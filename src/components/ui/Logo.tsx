import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="GCMS Logo" 
        className="h-12 w-auto"
      />
      <div className="text-center mt-2">
        <h1 className="text-xl font-bold text-gray-900">GCMS</h1>
        <p className="text-sm text-gray-500">Contract Management</p>
      </div>
    </div>
  );
}