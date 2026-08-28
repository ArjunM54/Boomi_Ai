'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, X, Play, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface HackathonDemoWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDemoWizard: React.FC<HackathonDemoWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    {
      title: "1. Hackathon Overview & Landing",
      route: "/",
      description: "Welcome to BhoomiAI — AI-Powered GIS Intelligence for Smarter Land Governance (SIH26014).",
      actionText: "Go to Landing Page"
    },
    {
      title: "2. Government Officer Dashboard",
      route: "/dashboard",
      description: "Executive analytics showing 12,450 parcels, priority alerts, survey rates, and embedded AI Assistant.",
      actionText: "View Dashboard Stats"
    },
    {
      title: "3. Interactive GIS Land Map",
      route: "/map",
      description: "Full-screen GeoJSON parcel visualization with layer toggles, risk color coding, and village filters.",
      actionText: "Explore GIS Map"
    },
    {
      title: "4. Demo Parcel P-00102 (Survey 102/3A)",
      route: "/parcels/P-00102",
      description: "Target agricultural parcel in Rampur village flagged for potential unauthorized construction.",
      actionText: "Inspect Demo Parcel"
    },
    {
      title: "5. AI Dual Image Analysis Studio",
      route: "/ai-analysis",
      description: "Compare 2025 vs 2026 aerial drone imagery. OpenCV AI engine detects new building structure & overlay mask.",
      actionText: "Run AI Analysis"
    },
    {
      title: "6. Transparent Risk & Alert Engine",
      route: "/alerts",
      description: "System automatically calculates 88.5/100 HIGH Risk score & generates High Priority Incident ALT-00102.",
      actionText: "View Generated Alerts"
    },
    {
      title: "7. Government Officer Verification",
      route: "/alerts/ALT-00102",
      description: "Authorized SDM officer reviews evidence images, adds verification audit notes, and updates status.",
      actionText: "Verify Alert as Officer"
    },
    {
      title: "8. Historical Change Timeline",
      route: "/timeline",
      description: "Complete land transformation history from agricultural field to verified building record.",
      actionText: "View Full Timeline"
    }
  ];

  if (!isOpen) return null;

  const step = steps[currentStep];

  const handleGo = (route: string) => {
    router.push(route);
  };

  const handleNext = () => {
    const nextIdx = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextIdx);
    router.push(steps[nextIdx].route);
  };

  const handlePrev = () => {
    const prevIdx = Math.max(currentStep - 1, 0);
    setCurrentStep(prevIdx);
    router.push(steps[prevIdx].route);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full bg-bhoomi-card/95 backdrop-blur-md border-2 border-emerald-500/50 rounded-2xl shadow-2xl p-5 text-white animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bhoomi-border pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-400">SIH 2026 Live Demo Storyboard</h4>
            <p className="text-[11px] text-gray-400">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-bhoomi-dark">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center space-x-1.5 mb-4">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentStep(idx);
              handleGo(s.route);
            }}
            className={`h-2 rounded-full transition-all ${
              idx === currentStep
                ? 'w-7 bg-emerald-400'
                : idx < currentStep
                ? 'w-2 bg-emerald-600'
                : 'w-2 bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <h3 className="font-bold text-base text-white">{step.title}</h3>
        <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-bhoomi-border">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 px-2 py-1 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <button
          onClick={() => handleGo(step.route)}
          className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>{step.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center space-x-1 text-xs bg-bhoomi-dark hover:bg-bhoomi-hover text-emerald-400 px-3 py-1.5 rounded-lg border border-bhoomi-border transition-colors font-medium disabled:opacity-30"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
