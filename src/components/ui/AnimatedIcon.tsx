'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animation?: 'bounce' | 'pulse' | 'spin' | 'float' | 'scale' | 'none';
  color?: string;
  hoverEffect?: boolean;
}

export default function AnimatedIcon({
  icon: Icon,
  size = 24,
  className = '',
  animation = 'none',
  color = 'currentColor',
  hoverEffect = true
}: AnimatedIconProps) {
  const getAnimationVariants = () => {
    switch (animation) {
      case 'bounce':
        return {
          animate: {
            y: [0, -10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        };
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.1, 1],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        };
      case 'spin':
        return {
          animate: {
            rotate: 360,
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: [0, 0, 1, 1]
            }
          }
        };
      case 'float':
        return {
          animate: {
            y: [0, -5, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        };
      case 'scale':
        return {
          animate: {
            scale: [1, 1.05, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        };
      default:
        return {};
    }
  };

  const hoverVariants = hoverEffect ? {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Icon
        size={size}
        color={color}
        className="drop-shadow-sm"
      />
    </div>
  );
}
