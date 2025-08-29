
import React, { useState, useCallback } from 'react';
import type { Plan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// These types are needed because the libraries are loaded from CDN
declare const jspdf: any;
declare const html2canvas: any;

interface ResultsScreenProps {
    plan: Plan;
    onReset: () => void;
}

const COLORS = ['#2563EB', '#60A5FA', '#F59E0B', '#9333EA', '#84CC16'];

const ResultsScreen: React.FC<ResultsScreenProps> = ({ plan, onReset }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { allocation, growth, inputs } = plan;

    const pieChartData = allocation.map(item => ({ name: item.etf, value: item.percentage }));

    const onDownloadPdf = useCallback(async () => {
        setIsDownloading(true);
        const element = document.getElementById('plan-to-download');
        if (!element) return;
        
        try {
            const { jsPDF } = jspdf;
            const canvas = await html2canvas(element, { 
                scale: 2, 
                backgroundColor: '#F9FAFB' // Match body background
            });
            
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('My_Investment_Plan.pdf');
        } catch (error) {
            console.error("Failed to download PDF", error);
            alert("Could not download PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 fade-in">
            <div id="plan-to-download" className="bg-background p-1">
                <h2 className="text-3xl font-bold text-primary mb-8 text-center" style={{ animationDelay: '100ms' }}>Your Personalized Investment Plan</h2>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface p-6 rounded-2xl shadow-lg" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-bold text-primary mb-4">Your Inputs</h3>
                            <ul className="space-y-2 text-primary">
                                <li><strong>Age:</strong> <span className="text-secondary">{inputs.age}</span></li>
                                <li><strong>Risk Style:</strong> <span className="text-secondary">{inputs.riskStyle}</span></li>
                                <li><strong>Time Horizon:</strong> <span className="text-secondary">{inputs.timeHorizon}</span></li>
                                <li><strong>Monthly Contribution:</strong> <span className="text-secondary">${inputs.monthlyContribution.toLocaleString()}</span></li>
                            </ul>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl shadow-lg" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-xl font-bold text-primary mb-4">Recommended Allocation</h3>
                            <ul className="space-y-4">
                                {allocation.map((item) => (
                                    <li key={item.etf}>
                                        <div className="flex justify-between font-semibold text-primary">
                                            <span>{item.etf}</span>
                                            <span className="text-secondary">{item.percentage}%</span>
                                        </div>
                                        <p className="text-sm text-secondary">{item.explanation}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="lg:col-span-3 bg-surface p-6 rounded-2xl shadow-lg" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-xl font-bold text-primary mb-4 text-center">Portfolio Visualization</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {pieChartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-surface p-6 rounded-2xl my-8 shadow-lg" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-xl font-bold text-primary mb-4">Projected Growth <span className="text-sm font-normal text-secondary">(Assumes 7% annual return)</span></h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(Number(value) / 1000)}k`} />
                            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-surface p-8 rounded-2xl shadow-lg" style={{ animationDelay: '600ms' }}>
                    <h3 className="text-xl font-bold text-primary mb-6">Your Action Checklist</h3>
                    <ol className="list-decimal list-inside space-y-4 text-secondary">
                        {['Open a brokerage account (e.g., Fidelity, Vanguard).', `Set up automated transfers of $${inputs.monthlyContribution.toLocaleString()}/month.`, 'Buy the recommended ETFs based on your allocation.', 'Enable automatic investing if your broker supports it.'].map((step, i) => (
                            <li key={i} className="pl-2"><span className="text-primary">{step}</span></li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4" style={{ animationDelay: '700ms' }}>
                <button onClick={onDownloadPdf} disabled={isDownloading} className="w-full md:w-auto px-8 py-3 bg-highlight text-white font-bold rounded-full shadow-lg shadow-highlight/30 hover:bg-highlight-hover transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                </button>
                <button onClick={onReset} className="w-full md:w-auto px-8 py-3 bg-surface text-primary font-bold rounded-full border border-border hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                    Start Over
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;
