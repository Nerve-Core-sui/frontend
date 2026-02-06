'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BattleStep } from '@/types/battle';
import { Swords, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface StepProgressProps {
  steps: BattleStep[];
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  const getStepIcon = (step: BattleStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'in-progress':
        return <Swords className="w-6 h-6 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getStepColor = (step: BattleStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'border-gold-500 bg-gold-500/20 text-gold-400';
      case 'failed':
        return 'border-red-500 bg-red-500/20 text-red-400';
      default:
        return 'border-gray-600 bg-gray-800/50 text-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2 -z-10" />

        {/* Progress overlay line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-gold-500 to-gold-400 -translate-y-1/2 -z-10 shadow-[0_0_10px_rgba(255,215,0,0.6)]"
          initial={{ width: '0%' }}
          animate={{
            width: `${(steps.filter((s) => s.status === 'completed').length / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step circle */}
            <motion.div
              className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 ${getStepColor(
                step
              )} backdrop-blur-sm transition-all duration-300`}
              animate={{
                scale: index === currentStep ? [1, 1.15, 1] : 1,
                boxShadow:
                  index === currentStep
                    ? [
                        '0 0 20px rgba(255,215,0,0.4)',
                        '0 0 30px rgba(255,215,0,0.8)',
                        '0 0 20px rgba(255,215,0,0.4)',
                      ]
                    : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{
                duration: 1.5,
                repeat: index === currentStep ? Infinity : 0,
              }}
            >
              {getStepIcon(step)}

              {/* Attack burst effect */}
              {step.status === 'in-progress' && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-gold-500"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-gold-400"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}

              {/* Completed checkmark glow */}
              {step.status === 'completed' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-500/30"
                  initial={{ scale: 1.5, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>

            {/* Step label */}
            <motion.div
              className="mt-3 text-center max-w-[120px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Attack {index + 1}
              </p>
              <p className="text-xs text-gray-500 leading-tight line-clamp-2">{step.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Current step description card */}
      {steps[currentStep] && (
        <motion.div
          key={currentStep}
          className="mt-8 p-4 rounded-lg border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-purple-500/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Swords className="w-6 h-6 text-gold-500" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
                Executing Attack {currentStep + 1}
              </p>
              <p className="text-sm text-gray-300 mt-1">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_0_10px_rgba(255,215,0,0.6)]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
