"use client";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const particles = [
    { left: '15%', top: '20%' },
    { left: '75%', top: '30%' },
    { left: '40%', top: '60%' },
    { left: '85%', top: '75%' },
    { left: '25%', top: '85%' },
    { left: '60%', top: '45%' },
  ];

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-gradient-to-br from-green-400 via-green-800 to-green-950 text-white overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-green-950 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-64 h-64 bg-green-600/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {particles.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-300/40 rounded-full"
            style={{
              left: position.left,
              top: position.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-green-400/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-green-500/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-green-950/50 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-20 right-1/4 w-16 h-16 border-2 border-green-400/30"
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/3 w-12 h-12 bg-green-500/20 rounded-lg"
          animate={{
            rotate: [0, -360],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 w-32 h-32 bg-green-400/20 rounded-full blur-xl"
          animate={{
            x: ["-100%", "100vw"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-950 to-transparent"
          animate={{
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center px-6 max-w-4xl">
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-green-200 via-green-100 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mitsians Connect
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-green-100/90 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Let's connect, clear doubts, have sessions, and share meaningful talks
            </motion.p>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}