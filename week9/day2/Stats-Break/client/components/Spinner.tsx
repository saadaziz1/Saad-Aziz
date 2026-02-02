import React from "react";

export default function GradientSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        {/* Retro-Tech gradient border ring */}
        <div className="absolute inset-0 border-4 border-t-transparent animate-spin 
          bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 
          [mask-image:linear-gradient(transparent,black)]">
        </div>

        {/* Inner circle (matching background) */}
        <div className="absolute inset-1 bg-panel border-2 border-cyan-900/50"></div>

        {/* Center dot */}
        <div className="absolute inset-5 bg-cyan-500 animate-pulse"></div>
      </div>
    </div>
  );
}
