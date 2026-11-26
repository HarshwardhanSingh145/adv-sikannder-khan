import React, { useState } from "react";
import { motion } from "motion/react";
import { Scale } from "lucide-react";

/**
 * EASY PHOTO REPLACEMENT:
 * To change Advocate Sikandar Khan's photograph, simply replace the URL below
 * with the direct link to the new photo (e.g. from Cloudinary, Imgur, or website assets).
 */
export const DEFAULT_ADVOCATE_PHOTO =
  "https://res.cloudinary.com/qlhljhvf/image/upload/v1785048467/file_0000000052a88208b5bd9dfbb761fdb0_xh7d71.png";

interface AdvocatePortraitProps {
  photoUrl?: string;
}

export default function AdvocatePortrait({
  photoUrl = DEFAULT_ADVOCATE_PHOTO,
}: AdvocatePortraitProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 70 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto lg:max-w-none group"
      id="advocate-portrait-section"
    >
      {/* PORTRAIT OUTER FRAME WITH LUXURY METALLIC BORDER & GLASS EFFECT */}
      <div
        className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] rounded-[16px] p-2.5 sm:p-3 bg-gradient-to-b from-gold-antique/20 via-emerald-deep/80 to-[#03110b] border border-gold-antique/40 shadow-[0_0_35px_rgba(212,175,55,0.18)] group-hover:shadow-[0_0_55px_rgba(212,175,55,0.32)] group-hover:border-gold-light/80 transition-all duration-700 ease-out backdrop-blur-md"
        id="portrait-frame-container"
      >
        {/* Subtle Inner Gold Accent Line */}
        <div className="relative w-full h-full rounded-[12px] overflow-hidden border border-gold-antique/30 p-1 bg-[#04120b]">
          {/* Subtle Ambient Golden Radial Glow behind image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none z-1" />

          {/* Portrait Image Holder */}
          <div className="relative w-full aspect-[3/4] rounded-[10px] overflow-hidden bg-[#030d08]">
            {!imgError ? (
              <img
                src={photoUrl}
                alt="Advocate Sikandar Khan"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                id="advocate-photo"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Fallback Graphic if Image link fails */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#082217] to-[#020b07] text-gold-antique">
                <div className="w-20 h-20 rounded-full border-2 border-gold-antique/40 flex items-center justify-center mb-4 bg-emerald-deep shadow-inner">
                  <Scale className="w-10 h-10 text-gold-antique" />
                </div>
                <span className="font-serif text-lg font-bold text-gold-light">
                  Advocate Sikandar Khan
                </span>
                <span className="text-xs text-gold-antique/70 mt-1">
                  Civil Court, Makrana
                </span>
              </div>
            )}

            {/* Subtle Metallic Highlight Sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

            {/* Bottom Gradient Fade for Smooth Blending */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#04120b] via-[#04120b]/60 to-transparent pointer-events-none z-10" />
          </div>
        </div>

        {/* Decorative Corner Ornaments (Subtle High-End Touches) */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-gold-antique/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-gold-antique/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-gold-antique/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-gold-antique/60 rounded-br-sm pointer-events-none" />
      </div>

      {/* NAME, DESIGNATION & MOTTO BELOW PORTRAIT */}
      <div className="mt-6 text-center flex flex-col items-center space-y-1.5 max-w-sm px-2">
        {/* Name */}
        <h3
          className="font-serif text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wide uppercase bg-gradient-to-r from-gold-light via-[#EFE9DC] to-gold-antique bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]"
          id="advocate-name"
        >
          Advocate Sikandar Khan
        </h3>

        {/* Designation */}
        <p
          className="font-sans text-xs sm:text-sm text-gold-antique/90 font-medium tracking-[0.2em] uppercase drop-shadow-sm"
          id="advocate-designation"
        >
          Civil Court, Makrana, 9828121482
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 py-1 my-0.5 opacity-75">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold-antique/60" />
          <Scale className="w-3.5 h-3.5 text-gold-antique" />
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold-antique/60" />
        </div>

        {/* Satyamev Jayate Motto */}
        <div
          className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-gradient-to-r from-gold-antique/10 via-gold-antique/20 to-gold-antique/10 border border-gold-antique/30 text-gold-light font-hi-serif text-sm sm:text-base font-semibold tracking-widest shadow-sm"
          id="advocate-motto"
        >
          सत्यमेव जयते
        </div>
      </div>
    </motion.div>
  );
}
