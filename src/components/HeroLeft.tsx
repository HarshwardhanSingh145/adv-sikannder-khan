import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroLeft() {
  const { language, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-start flex-1 max-w-4xl text-left pt-4 md:pt-8 pb-10"
      id="hero-left-container"
    >
      {/* Accent Subtitle */}
      <div className="flex items-center gap-3 mb-6" id="hero-subtitle">
        <span className="w-8 h-[1px] bg-gold-antique/50" />
        <span className={`text-xs font-semibold tracking-[0.2em] text-gold-antique ${
          language === "hi" ? "font-hi-sans text-sm" : "font-sans"
        }`}>
          {t.heroSubtitle}
        </span>
      </div>

      {/* Main Title */}
      <h1 className={`text-4xl sm:text-5xl lg:text-[64px] font-medium leading-[1.15] text-gold-light tracking-tight mb-6 ${
        language === "hi" ? "font-hi-serif" : "font-serif"
      }`} id="hero-main-title">
        {language === "hi" ? (
          <>
            {t.heroTitle1} <span className="text-gold-antique italic font-semibold">{t.heroTitle2}</span>
          </>
        ) : (
          <>
            Your Rights.<br />
            <span className="text-gold-antique italic font-semibold">Our Commitment.</span>
          </>
        )}
      </h1>

      {/* Decorative Calligraphic Divider */}
      <div className="flex items-center gap-4 my-2 opacity-80" id="hero-divider">
        <svg width="100" height="12" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-antique">
          <path d="M0 6H40" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <path d="M60 6H100" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          {/* Scroll loops in the center */}
          <path d="M42 6C45 3, 47 9, 50 6C53 3, 55 9, 58 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Tagline */}
      <h2 className={`text-lg sm:text-xl text-gold-antique font-normal tracking-wide mt-2 mb-4 ${
        language === "hi" ? "font-hi-serif" : "font-serif"
      }`} id="hero-tagline">
        {t.heroTagline}
      </h2>

      {/* Body Copy */}
      <p className={`text-sm sm:text-base text-gold-light/60 font-light leading-relaxed max-w-xl mb-10 ${
        language === "hi" ? "font-hi-sans" : "font-sans"
      }`} id="hero-description">
        {t.heroDesc}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-14" id="hero-ctas">
        <motion.a
          whileHover={{ scale: 1.02, backgroundColor: "#EFE9DC" }}
          whileTap={{ scale: 0.98 }}
          href="#consultation-section"
          className={`flex items-center gap-1.5 px-6 py-3.5 bg-gold-antique text-emerald-deep font-bold tracking-[0.1em] uppercase rounded-sm shadow-xl shadow-gold-antique/10 transition-colors duration-300 ${
            language === "hi" ? "font-hi-sans text-sm" : "font-sans text-xs"
          }`}
          id="cta-consult"
        >
          <span>{t.heroCtaConsult}</span>
          <ChevronRight className="w-4 h-4" />
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.02, borderColor: "#EFE9DC", color: "#EFE9DC" }}
          whileTap={{ scale: 0.98 }}
          href="#practice-section"
          className={`px-6 py-3.5 border border-gold-antique/40 text-gold-antique hover:text-gold-light hover:border-gold-light font-bold tracking-[0.1em] uppercase rounded-sm bg-transparent transition-all duration-300 ${
            language === "hi" ? "font-hi-sans text-sm" : "font-sans text-xs"
          }`}
          id="cta-practice"
        >
          {t.heroCtaPractices}
        </motion.a>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-3 gap-4 border-t border-gold-antique/10 pt-8" id="hero-stats">
        {/* Stat 1 */}
        <div className="flex flex-col gap-3 items-start" id="stat-experience">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border border-gold-antique/25 bg-emerald-deep/40 relative">
            {/* Laurel Wreath */}
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-gold-antique absolute inset-0">
              <path d="M12 28 C10 24, 10 16, 15 12" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" />
              <path d="M28 28 C30 24, 30 16, 25 12" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" />
              {/* Leaves */}
              <path d="M11 25 C9 24, 9 22, 11 21 M10 21 C8 20, 8 18, 10 17 M11 17 C10 15, 11 13, 13 13" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M29 25 C31 24, 31 22, 29 21 M30 21 C32 20, 32 18, 30 17 M29 17 C30 15, 29 13, 27 13" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            <span className={`text-xs font-bold text-gold-antique z-10 ${
              language === "hi" ? "font-hi-sans" : "font-serif"
            }`}>26+</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold tracking-[0.1em] text-gold-light leading-snug ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {t.heroStatYears}
            </span>
            <span className={`text-[8px] tracking-[0.1em] text-gold-antique/60 font-medium ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {t.heroStatExp}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col gap-3 items-start border-l border-gold-antique/10 pl-6" id="stat-court">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border border-gold-antique/25 bg-emerald-deep/40">
            {/* Courthouse Pillars Circle */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-gold-antique">
              <path d="M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M9 10v11M15 10v11M19 10v11" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold tracking-[0.1em] text-gold-light leading-snug ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {language === "hi" ? "सिविल कोर्ट," : "CIVIL COURT,"}
            </span>
            <span className={`text-[8px] tracking-[0.1em] text-gold-antique/60 font-medium ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {language === "hi" ? "मकराना" : "MAKRANA"}
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col gap-3 items-start border-l border-gold-antique/10 pl-6" id="stat-clients">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border border-gold-antique/25 bg-emerald-deep/40">
            {/* Person Icon Circle */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-gold-antique">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold tracking-[0.1em] text-gold-light leading-snug ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {t.heroStatClients}
            </span>
            <span className={`text-[8px] tracking-[0.1em] text-gold-antique/60 font-medium ${
              language === "hi" ? "font-hi-sans" : "font-sans"
            }`}>
              {t.heroStatTrust}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
