'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaVideo, FaRocket, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center relative">
      <motion.section
        className="text-center px-4 py-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          LOCL
        </motion.h1>
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Your Local Business, Elevated
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          We're building something amazing to empower local businesses. Get ready to transform your operations with our innovative platform.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg">
            Join Our Waitlist
          </Link>
        </motion.div>
      </motion.section>

      <section className="bg-gray-50 py-16 px-4 w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Features Coming Soon:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FaMapMarkerAlt className="text-4xl text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Real-time GPS Tracking</h4>
              <p className="text-gray-600 text-sm">Monitor deliveries and staff with live location updates.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaVideo className="text-4xl text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Live Chef Cam</h4>
              <p className="text-gray-600 text-sm">Engage customers with live views of their order's preparation.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FaRocket className="text-4xl text-green-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Streamlined Ordering</h4>
              <p className="text-gray-600 text-sm">Effortless mobile ordering for your customers.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FaShieldAlt className="text-4xl text-red-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Secure Payments</h4>
              <p className="text-gray-600 text-sm">Integrated, reliable, and secure payment processing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Placeholder for Animated Background or other global elements */}
      {/* This ensures the page structure is consistent with the layout */}
    </div>
  );
}
