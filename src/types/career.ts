export interface CareerSnapshot {
  education: string;
  skills: string[];
  goal: string;
  stage: "Exploration" | "Learning" | "Applying" | "Growing" | "Unknown";
  gaps: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect";
  options?: string[];
  placeholder?: string;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}
