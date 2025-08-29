
import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-highlight">
        <path d="M4 16V8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8V16C20 18.2091 18.2091 20 16 20H8C5.79086 20 4 18.2091 4 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 14L11 11L14 14L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
            <Logo />
            <h1 className="mt-6 text-4xl md:text-6xl font-bold text-primary">
                Investment Simplifier
            </h1>
            <p className="mt-4 text-lg md:text-xl text-secondary max-w-lg">
                Get a personalized, research-based ETF investing plan in minutes.
            </p>
            <button
                onClick={onStart}
                className="mt-12 px-10 py-4 bg-highlight text-white font-bold text-lg rounded-full shadow-lg shadow-highlight/30 hover:bg-highlight-hover transition-all duration-300 transform hover:scale-105"
            >
                Start My Plan
            </button>
        </div>
    );
};

export default WelcomeScreen;