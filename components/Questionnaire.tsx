
import React, { useState } from 'react';
import type { FormData, RiskStyle, TimeHorizon } from '../types';

interface QuestionnaireProps {
    onComplete: (formData: FormData) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        age: 30,
        riskStyle: 'Balanced',
        timeHorizon: '10+ years',
        monthlyContribution: 500,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isRadio = type === 'radio';
        const isNumberInput = name === 'age' || name === 'monthlyContribution';
        
        setFormData(prev => ({
            ...prev,
            [name]: isRadio ? value : (isNumberInput ? parseInt(value, 10) : value)
        }));
    };

    const progress = (step / 4) * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <label className="text-xl font-semibold text-primary">What is your current age?</label>
                        <p className="text-sm text-secondary mt-1">This helps us tailor your portfolio's risk level.</p>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-6 w-full p-4 bg-background border-2 border-border rounded-lg text-center text-2xl text-primary focus:outline-none focus:ring-2 focus:ring-highlight-focus focus:border-highlight transition" />
                    </div>
                );
            case 2:
                const riskOptions: RiskStyle[] = ['Growth', 'Balanced', 'Income'];
                return (
                    <div>
                        <label className="text-xl font-semibold text-primary">What is your risk style?</label>
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            {riskOptions.map(style => (
                                <label key={style} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${formData.riskStyle === style ? 'border-highlight bg-highlight/10' : 'border-border bg-background hover:border-gray-400'}`}>
                                    <input type="radio" name="riskStyle" value={style} checked={formData.riskStyle === style} onChange={handleChange} className="hidden" />
                                    <span className={`w-5 h-5 mr-4 inline-block rounded-full border-2 transition-colors ${formData.riskStyle === style ? 'bg-highlight border-highlight' : 'border-border'}`}></span>
                                    <span className="font-medium text-primary">{style}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                const timeHorizonOptions: TimeHorizon[] = ['<5 years', '5–10 years', '10+ years'];
                return (
                     <div>
                        <label className="text-xl font-semibold text-primary">What is your time horizon?</label>
                        <p className="text-sm text-secondary mt-1">How long do you plan to keep your money invested?</p>
                        <select name="timeHorizon" value={formData.timeHorizon} onChange={handleChange} className="mt-6 w-full p-4 bg-background border-2 border-border rounded-lg appearance-none text-lg text-primary focus:outline-none focus:ring-2 focus:ring-highlight-focus focus:border-highlight transition">
                            {timeHorizonOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <label className="text-xl font-semibold text-primary">How much will you invest monthly?</label>
                        <div className="text-center mt-6"><span className="text-5xl font-bold text-primary">${formData.monthlyContribution.toLocaleString()}</span></div>
                        <input type="range" min="50" max="5000" step="50" name="monthlyContribution" value={formData.monthlyContribution} onChange={handleChange} className="w-full mt-8 accent-highlight" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 fade-in">
            <div className="w-full max-w-lg bg-surface p-8 md:p-10 rounded-2xl shadow-xl">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div className="bg-highlight h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }}></div>
                </div>
                <div className="min-h-[220px]">{renderStep()}</div>
                <div className="flex justify-between items-center mt-8">
                    <button onClick={() => setStep(s => s - 1)} className={`px-6 py-2 rounded-full font-semibold text-secondary hover:text-primary hover:bg-gray-100 transition-colors ${step > 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>Back</button>
                    {step < 4 ?
                        <button onClick={() => setStep(s => s + 1)} className="px-8 py-3 bg-highlight text-white font-bold rounded-full hover:bg-highlight-hover transition transform hover:scale-105">Next</button> :
                        <button onClick={() => onComplete(formData)} className="px-8 py-3 bg-highlight text-white font-bold hover:bg-highlight-hover transition rounded-full transform hover:scale-105">See My Plan</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Questionnaire;
