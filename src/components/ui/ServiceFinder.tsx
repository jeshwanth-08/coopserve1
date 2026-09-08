'use client';
import React, { useState } from 'react';
import { services } from '../../data/services';

export const ServiceFinder: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'result'>('initial');
  const [selected, setSelected] = useState<string>('');

  const options = [
    { id: 'break', label: 'Something broke 🔧', services: ['AC Repair', 'Plumbing Repair', 'Electrician Service'] },
    { id: 'clean', label: 'Need cleaning 🧹', services: ['Home Deep Cleaning', 'AC Inspection'] },
    { id: 'beauty', label: 'Need beauty 💇', services: ['Haircut at home'] },
    { id: 'move', label: 'Moving house 📦', services: ['Moving Assistance'] },
    { id: 'maint', label: 'Need maintenance 🏠', services: ['Plumbing Repair', 'Electrician Service'] },
  ];

  const handleSelect = (optId: string) => {
    const opt = options.find(o => o.id === optId);
    if (opt) {
      setSelected(opt.services[0]); // pick first for demo
      setStep('result');
    }
  };

  const reset = () => {
    setStep('initial');
    setSelected('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">What happened?</h2>
      {step === 'initial' && (
        <div className="grid gap-3">
          {options.map(o => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition"
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {step === 'result' && (
        <div className="mt-4">
          <p className="mb-2">We recommend: <strong>{selected}</strong></p>
          <button onClick={reset} className="text-brand-600 underline">Choose again</button>
        </div>
      )}
    </div>
  );
};
