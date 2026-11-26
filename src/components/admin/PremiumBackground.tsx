import React from 'react';

export function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#EFE9DC] pointer-events-none transform-gpu will-change-transform">
      {/* Base Warm Canvas Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFE9DC] via-[#F6F3EB] to-[#EFE9DC]" />
      
      {/* Static GPU-Accelerated Subtle Light Blooms */}
      <div className="absolute -top-[15%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#706C61]/10 blur-[80px] transform-gpu pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#524738]/10 blur-[70px] transform-gpu pointer-events-none" />
      <div className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#706C61]/10 blur-[80px] transform-gpu pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#EFE9DC_100%)] opacity-70" />

      {/* Subtle Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}

