import { useEffect, useMemo, useReducer } from 'react';
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

type Action = { type: 'start' } | { type: 'next'; payload: { answer: string } };

const host = 'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io/';
const endpoints = {
  load: 'assessment',
  start: 'start',
  submit: 'answer',
  current: 'current',
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
  const nextState = { ...state };

  switch (action.type) {
    case 'start':
      nextState.hasStarted = true;

      useEffect(() => {
        // load assessment
        axios
          .get(`${host}${endpoints.load}`)
          .then((response) => {
            const { questions, answers } = response.data;
            nextState.answers = answers;
            nextState.questions = questions;
          })
          .catch((error) => {
            console.warn(error);
          });
      });

      useEffect(() => {
        // call start api
        axios
          .post(`${host}${endpoints.start}`)
          .then((response) => {
            const { answers, startDate } = response.data;
            console.info('assessment started', startDate, answers);
            nextState.isLoaded = true;
          })
          .catch((error) => {
            console.warn(error);
          });
      });
    default:
      return { ...nextState };
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

  const handleNext = async () => {
    if (isSaving) return;
    setIsSaving(true);
    console.info(`sending response ${userReponse} for quesiton #${counter}`);

    axios
      .post(`${host}${endpoints.submit}`, {
        questionOrder: counter,
        response: userReponse,
      })
      .then(() => {
        setCounter(counter + 1);
        setIsSaving(false);
        setUserResponse(undefined);
      })
      .catch((error) => console.warn(error));
  };
}
