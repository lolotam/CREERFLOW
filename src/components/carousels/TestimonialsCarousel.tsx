'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

interface Testimonial {
  id: string;
  name: string;
  nationality: string; // ISO country code
  role: string;
  photo: string;
  feedback: string;
  rating: number; // 1-5
  featured: boolean;
  created_at: string;
}

// Sample testimonials data (in production, this would come from API or database)
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Al-Mansouri',
    nationality: 'AE',
    role: 'Cardiologist at Dubai Hospital',
    photo: '/images/testimonials/sarah.jpg',
    feedback: 'CareerFlow helped me find my dream position in Dubai. The process was seamless and the support team was incredibly helpful throughout.',
    rating: 5,
    featured: true,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    nationality: 'EG',
    role: 'Registered Nurse at Kuwait Medical Center',
    photo: '/images/testimonials/ahmed.jpg',
    feedback: 'I found my current nursing position through CareerFlow. The platform made it easy to connect with top healthcare employers in Kuwait.',
    rating: 5,
    featured: true,
    created_at: '2024-01-20'
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    nationality: 'IN',
    role: 'Radiologist at King Faisal Hospital',
    photo: '/images/testimonials/priya.jpg',
    feedback: 'Excellent platform for healthcare professionals. I secured a radiology position in Riyadh within weeks of applying.',
    rating: 5,
    featured: true,
    created_at: '2024-02-01'
  },
  {
    id: '4',
    name: 'Maria Santos',
    nationality: 'PH',
    role: 'ICU Nurse at Sheikh Khalifa Medical City',
    photo: '/images/testimonials/maria.jpg',
    feedback: 'CareerFlow connected me with amazing opportunities in Abu Dhabi. The job matching system is incredibly accurate.',
    rating: 4,
    featured: true,
    created_at: '2024-02-10'
  },
  {
    id: '5',
    name: 'Dr. Omar Al-Rashid',
    nationality: 'SA',
    role: 'Emergency Medicine Physician',
    photo: '/images/testimonials/omar.jpg',
    feedback: 'Found my ideal emergency medicine role through CareerFlow. The platform understands the unique needs of healthcare professionals.',
    rating: 5,
    featured: true,
    created_at: '2024-02-15'
  },
  {
    id: '6',
    name: 'Jennifer Thompson',
    nationality: 'US',
    role: 'Pharmacy Manager at American Hospital',
    photo: '/images/testimonials/jennifer.jpg',
    feedback: 'Moving to Dubai for work was made easy with CareerFlow. They helped me navigate the entire process from application to relocation.',
    rating: 5,
    featured: true,
    created_at: '2024-02-20'
  }
];

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  'AE': '🇦🇪', 'SA': '🇸🇦', 'KW': '🇰🇼', 'QA': '🇶🇦', 'BH': '🇧🇭', 'OM': '🇴🇲',
  'EG': '🇪🇬', 'IN': '🇮🇳', 'PH': '🇵🇭', 'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦',
  'AU': '🇦🇺', 'ZA': '🇿🇦', 'NG': '🇳🇬', 'KE': '🇰🇪', 'LB': '🇱🇧', 'JO': '🇯🇴'
};

interface TestimonialsCarouselProps {
  className?: string;
}

export default function TestimonialsCarousel({ className = '' }: TestimonialsCarouselProps) {
  const t = useTranslations('testimonials');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
    slides: { perView: 1, spacing: 16 },
  });

  // Auto-play functionality
  useEffect(() => {
    if (!loaded || !instanceRef.current || isPaused) return;

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    return () => clearInterval(interval);
  }, [loaded, isPaused]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Quote className="text-pink-400 mr-3" size={32} />
            <h2 className="text-4xl md:text-5xl font-black text-white">
              {t('title')}
            </h2>
            <Quote className="text-pink-400 ml-3 rotate-180" size={32} />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="keen-slider__slide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="glass-card p-8 h-full relative overflow-hidden group hover:bg-white/20 transition-all duration-300">
                    {/* Gradient accent border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                         style={{ padding: '2px' }}>
                      <div className="bg-white rounded-2xl h-full w-full"></div>
                    </div>
                    
                    <div className="relative z-10">
                      {/* Header with photo and info */}
                      <div className="flex items-center mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          {/* Country flag */}
                          <div className="absolute -bottom-1 -right-1 text-lg">
                            {countryFlags[testimonial.nationality] || '🌍'}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-bold text-white text-lg">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-300 text-sm font-medium">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray-400">
                          ({testimonial.rating}/5)
                        </span>
                      </div>

                      {/* Testimonial text */}
                      <blockquote className="text-gray-200 leading-relaxed mb-4 italic">
                        &ldquo;{testimonial.feedback}&rdquo;
                      </blockquote>

                      {/* Quote decoration */}
                      <div className="absolute top-4 right-4 text-pink-300 opacity-50">
                        <Quote size={40} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 glass-card hover:bg-white/20 p-3 transition-all duration-300 z-10"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-4 top-1/2 -translate-y-1/2 glass-card hover:bg-white/20 p-3 transition-all duration-300 z-10"
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {loaded && instanceRef.current && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'bg-pink-500'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
