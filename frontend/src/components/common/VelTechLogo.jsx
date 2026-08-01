import React from 'react';

export default function VelTechLogo({ className = 'w-12 h-12', showText = true }) {
  return (
    <div className="flex items-center space-x-3">
      <img
        src="veltech_logo.png"
        alt="Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology"
        className={`object-contain rounded-full bg-white p-0.5 shadow-md border border-slate-200 shrink-0 ${className}`}
      />
      {showText && (
        <div className="text-left">
          <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-blue-700 bg-clip-text text-transparent block leading-tight">
            Vel Tech University
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block tracking-normal">
            R&D Institute of Science and Technology
          </span>
        </div>
      )}
    </div>
  );
}
