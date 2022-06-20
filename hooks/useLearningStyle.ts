import { useEffect, useMemo, useReducer, useState } from 'react';
import axios from 'axios';

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
  | { type: 'start' }
  | { type: 'ready' }
  | {
      type: 'load';
      payload: { questions: QuestionType[]; answers: AnswerType[] };
    }
  | { type: 'answer'; payload: { response: string } }
  | { type: 'next'; payload: { answer: string } };

const host = 'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io/';
const endpoints = {
  load: 'assessment',
  start: 'start',
  submit: 'answer',
  current: 'current',
};

/**
 * Load Learning Style assessment
 */
export const useAssessmentLoad = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [answers, setAnswers] = useState({} as AnswerType);

  useEffect(() => {
    axios
      .get(`${host}${endpoints.load}`)
      .then((response) => {
        const { questions, answers } = response.data;
        setQuestions(questions);
        setAnswers(answers);
        // nextState.answers = answers;
        // nextState.questions = questions;
        // return { ...nextState };
      })
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    questions,
    answers,
    loading,
  };
};

/**
 * Start Learning Style assessment
 */
export const useAssessmentStart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({} as any);

  useEffect(() => {
    axios
      .post(`${host}${endpoints.start}`)
      .then((response) => {
        // const { answers, startDate } = response.data;
        setData(response.data);
        console.info('assessment started', data.startDate, data.answers);
        // nextState.isLoaded = true;
        // return { ...nextState };
      })
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => setLoading(false));
  });

  return {
    data,
    loading,
  };
};

/**
 * Store answer for current Learning Style question
 */
export const useAssessmentAnswer = (order: number, response: string) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.info(`sending response ${response} for quesiton #${order}`);

    axios
      .post(`${host}${endpoints.submit}`, {
        questionOrder: order,
        response,
      })
      // .then(() => {
      //   setCounter(counter + 1);
      //   setIsSaving(false);
      //   setUserResponse(undefined);
      // })
      .catch((error) => console.warn(error))
      .finally(() => setLoading(false));
  });

  return { loading };
};

const defaultQuestion: QuestionType = { text: '', order: 0, category: '' };
const initialState = {
  questions: [defaultQuestion],
  answers: <AnswerType[]>[],
  counter: 1,
  hasStarted: false,
  isLoaded: false,
  isSaving: false,
  userResponse: <string | undefined>undefined,
};

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'start':
      return { ...state, hasStarted: true };
    case 'load':
      return {
        ...state,
        questions: action.payload.questions,
        answers: action.payload.answers,
        isLoaded: true,
      };
    case 'ready':
      return { ...state, isSaving: false };
    case 'answer':
      return { ...state, userResponse: action.payload.response };
    case 'next':
      return {
        ...state,
        isSaving: true,
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

export default function useLearningStyle() {
  const [state, action] = useReducer(reducer, initialState);
  const {
    questions,
    answers,
    counter,
    hasStarted,
    isLoaded,
    isSaving,
    userResponse,
  } = state;

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
    userResponse,
    currentQuestion,
    progressPercent,
    action,
  };
}
