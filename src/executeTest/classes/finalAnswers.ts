export interface FinalAnswers {
    [question_type: string]: {
        [id_question: number]: string | ValueAnswer | Array<number> | number;
    };
}

export interface ValueAnswer {
    [id_answer: number]: any;
}
