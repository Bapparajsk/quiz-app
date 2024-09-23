export interface QuestionTag {
    name: string;
}

export interface CorrectAnswers {
    answer_a_correct: string; // "true" or "false"
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
    [key: string]: string;
}

export interface Answers {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
    [key: string]: string | null; // Index signature to allow string indexing
}

export interface Question {
    id: number;
    question: string;
    description: string | null;
    answers: Answers;
    multiple_correct_answers: string; // "true" or "false"
    correct_answers: CorrectAnswers;
    correct_answer: string;
    explanation: string | null;
    tip: string | null;
    tags: QuestionTag[];
    category: string;
    difficulty: string;
    idx: number;
    bgColor: "default" | "completed" | "wrong" | "correct";
    isMarked?: number;
    yourAnswer?: string;
}