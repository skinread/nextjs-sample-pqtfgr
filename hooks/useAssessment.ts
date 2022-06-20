import { useMemo, useReducer } from 'react';

/**
 * Learning Style Assessment question content
 */
export interface QuestionType {
  order: number;
  text: string;
  category: string;
}

/**
 * Learning Style Assessment answer content
 */
export interface AnswerType {
  text: string;
  value: number;
}

type Action =
  | { type: 'START' }
  | { type: 'SAVING' }
  | { type: 'NEXT' }
  | {
      type: 'LOAD';
      payload: { questions: QuestionType[]; answers: AnswerType[] };
    };

export const defaultQuestion: QuestionType = {
  text: '',
  order: 0,
  category: '',
};
export const initialState = {
  questions: [defaultQuestion],
  answers: <AnswerType[]>[],
  counter: 1,
  hasStarted: false,
  isLoaded: false,
  isSaving: false,
};

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'START':
      return { ...state, hasStarted: true };
    case 'LOAD':
      const { questions, answers } = action.payload;
      console.info('loading assessment', questions, answers);
      return {
        ...state,
        questions,
        answers,
        isLoaded: true,
      };
    case 'SAVING':
      return {
        ...state,
        isSaving: true,
      };
    case 'NEXT':
      return {
        ...state,
        counter: state.counter + 1,
        isSaving: false,
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

export default function useAssessment() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, answers, counter, hasStarted, isLoaded, isSaving } = state;

  const currentQuestion = useMemo(
    () => questions.find((q) => q.order === counter) || defaultQuestion,
    [counter, questions]
  );
  const progressPercent = useMemo(() => {
    if (!isLoaded) return 0;
    return Math.round((counter / questions.length) * 100) - 1;
  }, [counter, questions]);

  return {
    questions,
    answers,
    counter,
    hasStarted,
    isLoaded,
    isSaving,
    currentQuestion,
    progressPercent,
    dispatch,
  };
}
