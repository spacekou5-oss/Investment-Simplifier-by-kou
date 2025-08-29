
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, AllocationItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const allocationSchema = {
    type: Type.OBJECT,
    properties: {
        allocation: {
            type: Type.ARRAY,
            description: "List of ETFs and their allocation percentage.",
            items: {
                type: Type.OBJECT,
                properties: {
                    etf: {
                        type: Type.STRING,
                        description: "The stock ticker symbol for the ETF (e.g., VTI, SCHD)."
                    },
                    percentage: {
                        type: Type.NUMBER,
                        description: "The percentage allocation for this ETF (e.g., 60)."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief, one-sentence explanation of why this ETF is included in the portfolio."
                    }
                },
                required: ["etf", "percentage", "explanation"]
            }
        }
    },
    required: ["allocation"]
};


export const getPortfolioAllocation = async (formData: FormData): Promise<AllocationItem[]> => {
    const { age, riskStyle, timeHorizon, monthlyContribution } = formData;

    const prompt = `
        Based on the following user profile, generate a suitable ETF portfolio allocation.
        - Age: ${age}
        - Stated Risk Style: ${riskStyle}
        - Investment Time Horizon: ${timeHorizon}
        - Monthly Contribution: $${monthlyContribution}

        Constraints:
        1. The total allocation must sum up to exactly 100%.
        2. Use common, low-cost, diversified ETFs available in the US market (e.g., VTI, VOO, SCHD, BND, VXUS, QQQM).
        3. The portfolio should be logically consistent with the user's profile. For example, a younger investor with a 'Growth' style should have a higher allocation to equities, while an older investor with an 'Income' style should have more bonds and dividend-focused ETFs.
        4. Provide a brief, one-sentence explanation for each ETF's role in the portfolio.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: allocationSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (!result.allocation || !Array.isArray(result.allocation)) {
            throw new Error("Invalid allocation format received from AI.");
        }

        const totalPercentage = result.allocation.reduce((sum: number, item: AllocationItem) => sum + item.percentage, 0);

        if (Math.abs(100 - totalPercentage) > 1) { // Allow for small rounding errors
            throw new Error(`AI returned an allocation that does not sum to 100% (got ${totalPercentage}%). Please try again.`);
        }
        
        return result.allocation as AllocationItem[];

    } catch (error) {
        console.error("Error fetching portfolio allocation from Gemini API:", error);
        throw new Error("Failed to generate investment plan. The AI model may be temporarily unavailable.");
    }
};
