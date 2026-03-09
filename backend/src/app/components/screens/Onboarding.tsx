import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useNavigate } from 'react-router';

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

// Placeholder SVG illustrations
const IllustrationSchool = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#F0A500" opacity="0.1" />
    <rect x="60" y="80" width="80" height="60" rx="4" fill="#F0A500" />
    <path d="M100 50L140 80H60L100 50Z" fill="#F0A500" />
    <rect x="90" y="110" width="20" height="30" fill="#0D1B2A" />
    <circle cx="75" cy="100" r="6" fill="#0D1B2A" />
    <circle cx="125" cy="100" r="6" fill="#0D1B2A" />
  </svg>
);

const IllustrationEscalation = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#F0A500" opacity="0.1" />
    <circle cx="100" cy="140" r="20" fill="#F0A500" opacity="0.6" />
    <circle cx="70" cy="100" r="20" fill="#F0A500" opacity="0.8" />
    <circle cx="130" cy="100" r="20" fill="#F0A500" opacity="0.8" />
    <circle cx="100" cy="60" r="20" fill="#F0A500" />
    <path d="M100 120L100 80" stroke="#F0A500" strokeWidth="3" />
    <path d="M90 95L70 110" stroke="#F0A500" strokeWidth="3" />
    <path d="M110 95L130 110" stroke="#F0A500" strokeWidth="3" />
  </svg>
);

const IllustrationTracking = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#F0A500" opacity="0.1" />
    <rect x="70" y="60" width="60" height="80" rx="4" fill="#F0A500" opacity="0.3" />
    <rect x="80" y="75" width="40" height="8" rx="2" fill="#F0A500" />
    <rect x="80" y="90" width="40" height="8" rx="2" fill="#F0A500" />
    <rect x="80" y="105" width="40" height="8" rx="2" fill="#F0A500" />
    <circle cx="90" cy="79" r="3" fill="#0D1B2A" />
    <circle cx="90" cy="94" r="3" fill="#0D1B2A" />
    <path d="M87 109L90 112L96 106" stroke="#0D1B2A" strokeWidth="2" fill="none" />
  </svg>
);

const onboardingSlides = [
  {
    id: 1,
    illustration: <IllustrationSchool />,
    heading: 'Welcome to SETU',
    headingKey: 'onboard_h1',
    body: 'Report school issues in 2 minutes. Track every report to resolution.',
    bodyKey: 'onboard_body1',
  },
  {
    id: 2,
    illustration: <IllustrationEscalation />,
    heading: 'Your Report Reaches the Right Person',
    headingKey: 'onboard_h2',
    body: 'Smart auto-escalation ensures your grievance reaches district and state officials if unresolved.',
    bodyKey: 'onboard_body2',
  },
  {
    id: 3,
    illustration: <IllustrationTracking />,
    heading: 'Nothing Gets Lost',
    headingKey: 'onboard_h3',
    body: 'Every report is tracked from submission to resolution. Full transparency, always.',
    bodyKey: 'onboard_body3',
  },
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slide = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="fixed inset-0 bg-[#0D1B2A] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-end p-4 gap-3 z-10">
        <LanguageToggle size="compact" />
        <button
          onClick={() => navigate('/login')}
          className="text-white text-sm min-h-[48px] px-4"
          data-i18n="btn_skip"
        >
          Skip
        </button>
      </div>

      {/* Carousel Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold && currentSlide < onboardingSlides.length - 1) {
                setDirection(1);
                setCurrentSlide((prev) => prev + 1);
              } else if (swipe > swipeConfidenceThreshold && currentSlide > 0) {
                setDirection(-1);
                setCurrentSlide((prev) => prev - 1);
              }
            }}
            className="w-full max-w-md flex flex-col items-center"
          >
            {/* Illustration */}
            <div className="mb-8">{slide.illustration}</div>

            {/* Heading */}
            <h1
              className="text-white font-bold text-center mb-4"
              style={{ fontSize: '28px', fontFamily: 'Noto Sans' }}
              data-i18n={slide.headingKey}
            >
              {slide.heading}
            </h1>

            {/* Body */}
            <p
              className="text-[#E5E7EB] text-center leading-relaxed"
              style={{ fontSize: '16px', fontFamily: 'Noto Sans', paddingLeft: '24px', paddingRight: '24px' }}
              data-i18n={slide.bodyKey}
            >
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-4">
        {/* Dot Pagination */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="transition-all duration-300"
              style={{
                height: '8px',
                width: currentSlide === index ? '24px' : '8px',
                borderRadius: currentSlide === index ? '4px' : '50%',
                backgroundColor: currentSlide === index ? '#F0A500' : '#6B7280',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#F0A500] text-[#0D1B2A] font-bold transition-colors hover:bg-[#FDB913]"
          style={{
            height: '56px',
            fontSize: '16px',
            borderRadius: '8px',
            fontFamily: 'Noto Sans',
          }}
          data-i18n={isLastSlide ? 'btn_get_started' : 'btn_next'}
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
