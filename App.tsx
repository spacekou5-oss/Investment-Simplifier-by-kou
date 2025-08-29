
import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Questionnaire from './components/Questionnaire';
import ResultsScreen from './components/ResultsScreen';
import Spinner from './components/Spinner';
import { getPortfolioAllocation } from './services/geminiService';
import type { FormData, Plan, GrowthDataPoint, AllocationItem } from './types';

type View = 'welcome' | 'questionnaire' | 'loading' | 'results' | 'error';

const calculateGrowthProjection = (monthlyContribution: number): GrowthDataPoint[] => {
    const data: GrowthDataPoint[] = [];
    const years = [0, 5, 10, 15, 20, 25, 30];
    const annualRate = 0.07; // Assumed 7% annual return
    const monthlyRate = annualRate / 12;

    for (const t of years) {
        const months = t * 12;
        const futureValue = (t === 0) 
            ? 0 
            : monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        
        data.push({
            name: `${t} Yrs`,
            value: Math.round(futureValue),
        });
    }
    return data;
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('welcome');
    const [plan, setPlan] = useState<Plan | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastFormData, setLastFormData] = useState<FormData | null>(null);

    useEffect(() => {
        try {
            const savedPlan = localStorage.getItem('investmentPlan');
            if (savedPlan) {
                const parsedPlan: Plan = JSON.parse(savedPlan);
                setPlan(parsedPlan);
                setLastFormData(parsedPlan.inputs);
                setView('results');
            }
        } catch (e) {
            console.error("Failed to parse saved plan:", e);
            localStorage.removeItem('investmentPlan');
        }
    }, []);

    const changeView = (newView: View) => {
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleQuestionnaireComplete = useCallback(async (formData: FormData) => {
        changeView('loading');
        setLastFormData(formData);
        setError(null);
        try {
            const allocationResult = await getPortfolioAllocation(formData);
            const growth = calculateGrowthProjection(formData.monthlyContribution);
            
            const newPlan: Plan = {
                inputs: formData,
                allocation: allocationResult,
                growth,
            };
            
            setPlan(newPlan);
            localStorage.setItem('investmentPlan', JSON.stringify(newPlan));
            changeView('results');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
            changeView('error');
        }
    }, []);

    const handleStartOver = () => {
        localStorage.removeItem('investmentPlan');
        setPlan(null);
        setLastFormData(null);
        changeView('welcome');
    };

    const handleTryAgain = () => {
        if(lastFormData) {
            handleQuestionnaireComplete(lastFormData);
        } else {
            changeView('questionnaire');
        }
    }

    const renderView = () => {
        switch (view) {
            case 'questionnaire':
                return <Questionnaire onComplete={handleQuestionnaireComplete} />;
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                        <Spinner />
                        <h2 className="text-2xl font-bold text-primary mt-6">Generating Your Plan...</h2>
                        <p className="mt-2 text-secondary">Our AI is crafting a personalized portfolio just for you.</p>
                    </div>
                );
            case 'results':
                return plan ? <ResultsScreen plan={plan} onReset={handleStartOver} /> : null;
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
                        <h1 className="text-3xl font-bold text-red-600">Something Went Wrong</h1>
                        <p className="mt-4 text-lg text-secondary max-w-lg">{error}</p>
                        <div className="mt-10 flex gap-4">
                             <button 
                                onClick={handleTryAgain}
                                className="px-8 py-3 bg-highlight text-white font-bold text-lg rounded-full shadow-lg shadow-highlight/30 hover:bg-highlight-hover transition-all duration-300 transform hover:scale-105"
                            >
                                Try Again
                            </button>
                             <button 
                                onClick={handleStartOver}
                                className="px-8 py-3 bg-surface text-primary font-bold rounded-full border border-border hover:bg-gray-100 transition-all duration-300"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                );
            case 'welcome':
            default:
                return <WelcomeScreen onStart={() => changeView('questionnaire')} />;
        }
    };

    return <div className="min-h-screen">{renderView()}</div>;
}

export default App;
