import { Variants } from 'framer-motion';

export const cardFlipVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    rotateY: 180,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotateY: -180,
    transition: { duration: 0.3 },
  },
};

export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: { duration: 0.3 },
  },
};

export const scaleInVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(157, 78, 221, 0.3)',
      '0 0 40px rgba(157, 78, 221, 0.6)',
      '0 0 20px rgba(157, 78, 221, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const buttonHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export const wheelSpinVariants: Variants = {
  animate: {
    rotate: 1800,
    transition: {
      duration: 4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};
