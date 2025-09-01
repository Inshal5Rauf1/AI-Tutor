
export enum Activity {
  Summary = 'Summary',
  Vocabulary = 'Vocabulary',
  Comprehension = 'Comprehension',
  Writing = 'Writing',
  Tutor = 'Tutor',
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
  translation: string;
}

export interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
}

export interface WritingFeedback {
  correctedText: string;
  explanations: { original: string; correction: string; reason: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ActivityData {
  [Activity.Summary]?: string;
  [Activity.Vocabulary]?: VocabularyItem[];
  [Activity.Comprehension]?: ComprehensionQuestion[];
  [Activity.Writing]?: WritingFeedback;
  [Activity.Tutor]?: ChatMessage[];
}
