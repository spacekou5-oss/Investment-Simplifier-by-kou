
import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
                Investment Simplifier
            </h1>
            <p className="mt-4 text-lg md:text-xl text-secondary max-w-lg">
                Get your personalized, AI-powered ETF investing plan in minutes.
            </p>
            <button
                onClick={onStart}
                className="mt-10 px-10 py-4 bg-highlight text-white font-bold text-lg rounded-full shadow-lg shadow-highlight/30 hover:bg-highlight-hover transition-all duration-300 transform hover:scale-105"
            >
                Start My Plan
            </button>
        </div>
    );
};

export default WelcomeScreen;
