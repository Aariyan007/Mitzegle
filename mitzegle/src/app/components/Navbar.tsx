'use client'
import React from 'react'
import { motion } from 'motion/react'

const Navbar = () => {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}

            animate={{ y: 0, opacity: 1 }}

            transition={{ duration: 0.6, ease: "easeOut" }}

            className='fixed top-0 left-0 right-0 z-30 backdrop-blur-md border-b border-emerald-500/20 w-full h-16 sm:h-16 overflow-hidden'
        >
            <motion.div
                className='absolute inset-0 opacity-60'

                animate={{
                    background: [
                        'linear-gradient(45deg, #0a0e0d 0%, #0d1f1a 50%, #0a0e0d 100%)',

                        'linear-gradient(90deg, #0d1f1a 0%, #10362b 50%, #0d1f1a 100%)',

                        'linear-gradient(135deg, #0a0e0d 0%, #0d1f1a 50%, #0a0e0d 100%)',

                        'linear-gradient(180deg, #0d1f1a 0%, #10362b 50%, #0d1f1a 100%)',

                        'linear-gradient(45deg, #0a0e0d 0%, #0d1f1a 50%, #0a0e0d 100%)',
                    ]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i} className='absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl'
                    style={{
                        background: i === 0 ? 'rgba(16, 185, 129, 0.15)' :
                            i === 1 ? 'rgba(20, 184, 166, 0.15)' :
                                'rgba(52, 211, 153, 0.12)',
                    }}
                    animate={{
                        x: ['-10%', '110%'],
                        y: [i * 8, i * 8],


                    }}
                    transition={{
                        duration: 15 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                    }}
                />
            ))}
            <div className='absolute inset-0 opacity-10'
                style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-center relative z-10'>
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='font-bold text-lg sm:text-2xl tracking-wider sm:tracking-widest relative'
                    style={{ fontFamily: '"Orbitron", "Space Grotesk", sans-serif' }}
                >
                    {'MITZEGLE'.split('').map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}



                            transition={{
                                delay: 0.4 + index * 0.05,
                                duration: 0.3
                            }}
                            whileHover={{
                                y: -3,
                                textShadow: '0 0 25px rgba(16, 185, 129, 0.8)',

                                transition: { duration: 0.2 }
                            }}
                            className='inline-block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent'
                        >
                            {letter}
                        </motion.span>
                    ))}
                    <motion.span className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                        initial={{ width: 0 }}
                        animate={{
                            width: ['0%', '100%', '0%'],
                        }}
                        transition={{
                            duration: 3,

                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }}
                    />
                </motion.span>
                <motion.div className='absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent'
                    animate={{
                        x: ['-100%', '200%'],

                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2
                    }} style={{ pointerEvents: 'none' }}
                />
            </div>
        </motion.div>
    )
}

export default Navbar