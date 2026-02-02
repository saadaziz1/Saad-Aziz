'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const GoogleLoader = () => {
    const dotTransition = {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut",
    };

    return (
        <div className="flex items-center justify-center gap-2 h-8">
            <motion.div
                className="w-2.5 h-2.5 bg-teal-500 rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ ...dotTransition, delay: 0 }}
            />
            <motion.div
                className="w-2.5 h-2.5 bg-cyan-500 rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ ...dotTransition, delay: 0.1 }}
            />
            <motion.div
                className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ ...dotTransition, delay: 0.2 }}
            />
            <motion.div
                className="w-2.5 h-2.5 bg-sky-500 rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ ...dotTransition, delay: 0.3 }}
            />
        </div>
    );
};
