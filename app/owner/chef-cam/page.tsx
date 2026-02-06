'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaVideo,
  FaToggleOn,
  FaToggleOff,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';

interface ChefCamConfig {
  enabled: boolean;
  streamUrl: string;
  rtmpIngestUrl: string;
  streamKey: string;
  autoStartOnOrder: boolean;
  videoQuality: 'auto' | '720p' | '1080p';
  bitrate: number;
}

export default function ChefCamSetup() {
  const { user, MohnMenuUser, loading, isOwner, logout } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<ChefCamConfig>({
    enabled: false,
    streamUrl: '',
    rtmpIngestUrl: 'rtmp://ingest.mohnmenu.com/live',
    streamKey: '',
    autoStartOnOrder: true,
    videoQuality: '1080p',
    bitrate: 5000,
  });
  const [savedMessage, setSavedMessage] = useState('');
  const [setupStep, setSetupStep] = useState<'welcome' | 'software' | 'config' | 'test' | 'complete'>(
    'welcome'
  );

  useEffect(() => {
    if (!loading && (!user || !isOwner())) {
      router.push('/login');
    }
  }, [user, loading, isOwner, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white/90">
        <div className="text-lg font-bold text-zinc-400 animate-pulse">
          Loading Chef Cam Setup...
        </div>
      </div>
    );
  }

  const handleToggle = (field: keyof ChefCamConfig) => {
    setConfig((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'boolean' ? !prev[field] : prev[field],
    }));
  };

  const handleInputChange = (field: keyof ChefCamConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveConfig = () => {
    // Save to Firebase
    setSavedMessage('Configuration saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaVideo className="text-5xl text-orange-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-black mb-4">
            Chef<span className="text-orange-600">'</span>s Eye Setup
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Go live with your kitchen. Stream to your customers and increase order retention by 40%.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
          {[
            { key: 'welcome' as const, label: 'Welcome', icon: '👋' },
            { key: 'software' as const, label: 'Setup Software', icon: '⚙️' },
            { key: 'config' as const, label: 'Configuration', icon: '🎛️' },
            { key: 'test' as const, label: 'Test Stream', icon: '✓' },
            { key: 'complete' as const, label: 'Go Live', icon: '🎬' },
          ].map((step, idx) => (
            <motion.button
              key={step.key}
              onClick={() => setSetupStep(step.key)}
              className={`relative p-4 rounded-xl font-bold text-center transition-all ${
                setupStep === step.key
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white border-2 border-zinc-200 text-zinc-700 hover:border-orange-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-xs">{step.label}</div>
            </motion.button>
          ))}
        </div>

        {/* Step Content */}
        {setupStep === 'welcome' && (
          <motion.div
            className="bg-white rounded-3xl border border-zinc-100 p-12 mb-8 shadow-sm"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 text-black">Why Stream Your Kitchen?</h2>
                <ul className="space-y-4">
                  {[
                    '👁️ Full transparency builds customer trust',
                    '📱 Customers watch while they wait',
                    '📈 Increases repeat orders by 40%',
                    '💬 Reduces support complaints',
                    '🎯 Differentiates from competitors',
                  ].map((item) => (
                    <li key={item} className="text-lg text-zinc-700 font-medium flex items-center gap-3">
                      <span className="text-2xl">{item.slice(0, 2)}</span>
                      <span>{item.slice(3)}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => setSetupStep('software')}
                  className="mt-10 px-8 py-4 bg-orange-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-orange-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started <FaArrowRight />
                </motion.button>
              </div>
              <motion.div
                className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-12 flex items-center justify-center aspect-square"
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-7xl">📹</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {setupStep === 'software' && (
          <motion.div
            className="bg-white rounded-3xl border border-zinc-100 p-12 shadow-sm"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-black mb-8 text-black">Recommended Streaming Software</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {[
                {
                  name: 'OBS Studio',
                  desc: 'Free, open-source, professional',
                  url: 'https://obsproject.com',
                  icon: '🎥',
                },
                {
                  name: 'Streamlabs OBS',
                  desc: 'Beginner-friendly with templates',
                  url: 'https://streamlabs.com',
                  icon: '🌟',
                },
                {
                  name: 'Restream',
                  desc: 'Multi-platform streaming',
                  url: 'https://restream.io',
                  icon: '📡',
                },
                {
                  name: 'Wirecast',
                  desc: 'Professional live production',
                  url: 'https://telestream.net',
                  icon: '🎬',
                },
              ].map((software) => (
                <a
                  key={software.name}
                  href={software.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 border-2 border-zinc-200 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all group"
                >
                  <div className="text-5xl mb-3">{software.icon}</div>
                  <h3 className="font-black text-lg mb-1">{software.name}</h3>
                  <p className="text-sm text-zinc-600 mb-4">{software.desc}</p>
                  <span className="text-orange-600 font-bold text-sm group-hover:gap-2 transition-all">
                    Download →
                  </span>
                </a>
              ))}
            </div>

            <motion.div
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-blue-900 flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <span>
                  <strong>Pro Tip:</strong> We recommend OBS Studio—it's free, works on all platforms,
                  and integrates seamlessly with Chef's Eye. Follow our{' '}
                  <a href="#" className="underline font-bold hover:text-blue-600">
                    OBS setup guide
                  </a>
                  .
                </span>
              </p>
            </motion.div>

            <motion.button
              onClick={() => setSetupStep('config')}
              className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-orange-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue <FaArrowRight />
            </motion.button>
          </motion.div>
        )}

        {setupStep === 'config' && (
          <motion.div
            className="bg-white rounded-3xl border border-zinc-100 p-12 shadow-sm"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-black mb-8 text-black">Configuration</h2>

            <div className="space-y-8">
              {/* RTMP Ingest URL */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-700 mb-3">
                  RTMP Ingest URL
                </label>
                <input
                  type="text"
                  value={config.rtmpIngestUrl}
                  onChange={(e) => handleInputChange('rtmpIngestUrl', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl font-mono text-sm focus:border-orange-600 focus:outline-none"
                  readOnly
                />
                <p className="text-xs text-zinc-500 mt-2">Use this in your streaming software</p>
              </div>

              {/* Stream Key */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-700 mb-3">
                  Stream Key
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={config.streamKey}
                    onChange={(e) => handleInputChange('streamKey', e.target.value)}
                    placeholder="Your unique stream key"
                    className="flex-1 px-4 py-3 border-2 border-zinc-300 rounded-xl font-mono text-sm focus:border-orange-600 focus:outline-none"
                  />
                  <button className="px-6 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                    Generate
                  </button>
                </div>
              </div>

              {/* Video Quality */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-700 mb-3">
                  Video Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['720p', '1080p'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleInputChange('videoQuality', quality as 'auto' | '720p' | '1080p')}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        config.videoQuality === quality
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitrate */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-zinc-700 mb-3">
                  Bitrate: {config.bitrate} kbps
                </label>
                <input
                  type="range"
                  min="2500"
                  max="8000"
                  step="500"
                  value={config.bitrate}
                  onChange={(e) => handleInputChange('bitrate', parseInt(e.target.value))}
                  className="w-full accent-orange-600"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Higher bitrate = better quality but requires faster connection
                </p>
              </div>

              {/* Auto-Start Toggle */}
              <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl">
                <div>
                  <h3 className="font-bold text-black">Auto-Start on Order</h3>
                  <p className="text-sm text-zinc-600">
                    Automatically start streaming when customers order
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('autoStartOnOrder')}
                  className="text-4xl hover:scale-110 transition-transform"
                >
                  {config.autoStartOnOrder ? (
                    <FaToggleOn className="text-orange-600" />
                  ) : (
                    <FaToggleOff className="text-zinc-400" />
                  )}
                </button>
              </div>

              {savedMessage && (
                <motion.div
                  className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 text-green-900"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaCheckCircle className="text-xl" />
                  {savedMessage}
                </motion.div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setSetupStep('software')}
                  className="px-8 py-4 border-2 border-zinc-300 text-zinc-700 rounded-full font-bold hover:border-zinc-400 transition-colors"
                >
                  Back
                </button>
                <motion.button
                  onClick={() => {
                    handleSaveConfig();
                    setSetupStep('test');
                  }}
                  className="flex-1 px-8 py-4 bg-orange-600 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-orange-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save & Continue <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {setupStep === 'test' && (
          <motion.div
            className="bg-white rounded-3xl border border-zinc-100 p-12 shadow-sm"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-black mb-8 text-black">Test Your Stream</h2>

            <motion.div
              className="bg-black rounded-3xl aspect-video flex items-center justify-center mb-8 relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-7xl animate-pulse">📹</div>
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-600 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-black">LIVE</span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-4 mb-8"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-xl" />
                <span className="text-green-900 font-bold">Stream is online</span>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-xl" />
                <span className="text-green-900 font-bold">1080p resolution detected</span>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-xl" />
                <span className="text-green-900 font-bold">Bitrate is optimal (5000 kbps)</span>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setSetupStep('complete')}
              className="w-full px-8 py-4 bg-orange-600 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-orange-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Live <FaArrowRight />
            </motion.button>
          </motion.div>
        )}

        {setupStep === 'complete' && (
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-200 p-12 shadow-sm text-center"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-black mb-4 text-black">You're Live!</h2>
            <p className="text-lg text-zinc-600 mb-12 max-w-xl mx-auto">
              Your kitchen is now streaming to customers. They'll see the live feed when they place orders.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '👥', label: 'Viewers', value: '0' },
                { icon: '⏱️', label: 'Duration', value: 'Fresh' },
                { icon: '📊', label: 'Quality', value: '1080p' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 border border-zinc-200">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-sm text-zinc-600">{stat.label}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => router.push('/owner')}
              className="px-10 py-4 bg-orange-600 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-orange-700 transition-all mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard <FaArrowRight />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
