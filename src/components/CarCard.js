'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CarCard({ car }) {
  const [isHovered, setIsHovered] = useState(false);

  const infoBoxVariants = {
    hidden: { opacity: 0, width: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    visible: { opacity: 1, width: 'auto', transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut', delay: 0.5 } },
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:shadow-2xl ${
        car.size === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
        {/* Video and Image Container */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence>
            {!isHovered && (
              <motion.img
                key="image"
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}
            {isHovered && (
              <motion.video
                key="video"
                className="w-full h-full object-cover"
                src={car.video}
                autoPlay
                loop
                muted
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Info Box - Expands to the right */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={infoBoxVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-0 h-full bg-black bg-opacity-70 text-white p-6 flex flex-col justify-center"
              style={{ backdropFilter: 'blur(10px)' }}
            >
                <motion.div variants={textVariants}>
                    <h3 className="text-xl font-bold whitespace-nowrap">{car.name}</h3>
                    <div className="mt-4 space-y-2 text-sm whitespace-nowrap">
                        <p><span className="font-semibold">Scale:</span> {car.scale}</p>
                        <p><span className="font-semibold">Brand:</span> {car.brand}</p>
                        <p className="text-lg font-bold mt-2">{car.price}</p>
                    </div>
                    <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 whitespace-nowrap">
                        Add to Collection
                    </button>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
       {/* Static Title when not hovered */}
       <AnimatePresence>
        {!isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: {delay: 0.2} }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-white text-lg font-bold">{car.name}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
