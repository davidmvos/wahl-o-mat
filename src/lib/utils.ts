import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateResults(
  userAnswers: Record<string, { value: number; isWeighted: boolean }>,
  parties: any[],
  questions: any[]
) {
  return parties.map((party) => {
    let score = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      const partyAns = party.answers[q.id];

      if (userAns !== undefined && partyAns !== undefined) {
        const weight = userAns.isWeighted ? 2 : 1;
        maxScore += 2 * weight; // Max difference is 2 points (e.g., 1 vs -1)
        
        // Difference points: 
        // Same answer: 2 points
        // Neutral vs Agree/Disagree: 1 point
        // Agree vs Disagree: 0 points
        const diff = Math.abs(userAns.value - partyAns);
        const points = 2 - diff;
        
        score += points * weight;
      }
    });

    return {
      partyId: party.id,
      partyName: party.name,
      score: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      color: party.color,
      description: party.description,
    };
  }).sort((a, b) => b.score - a.score);
}
