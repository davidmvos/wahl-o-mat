export type AnswerValue = 1 | 0 | -1; // Agree, Neutral, Disagree

export interface Question {
  id: string;
  text: string;
  category?: string;
}

export interface Party {
  id: string;
  name: string;
  logo?: string;
  color?: string;
  answers: Record<string, AnswerValue>; // questionId -> answerValue
  description?: string;
}

export interface ElectionConfig {
  electionName: string;
  questions: Question[];
  parties: Party[];
}

export interface UserAnswer {
  questionId: string;
  value: AnswerValue;
  isWeighted: boolean;
}

export interface Result {
  partyId: string;
  partyName: string;
  score: number; // percentage similarity
  color?: string;
  description?: string;
}
