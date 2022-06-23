import axios from 'axios';
import z from 'zod';
import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from 'react-query';
import { Button, Text, RadioGroup, Radio, Stack } from '@mantine/core';
import { ProgressBar } from './';

const assessmentValidator = z.object({
  answers: z
    .object({
      value: z.number(),
      text: z.string(),
    })
    .array(),
  questions: z
    .object({
      category: z.string(),
      order: z.number(),
      text: z.string(),
    })
    .array(),
});

const initialAssessmentData = {
  answers: [
    {
      value: 0,
      text: '',
    },
  ],
  questions: [
    {
      text: '',
      order: 0,
      category: '',
    },
  ],
} as const;

type AssessmentData = z.infer<typeof assessmentValidator>;
type AnswerPostData = {
  questionOrder: number;
  response: string;
};

const endpoint = 'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io';

function useAssessmentQA({ hasStarted }: { hasStarted: boolean }) {
  const url = `${endpoint}/assessment`;
  return useQuery(
    ['load'],
    async (): Promise<AssessmentData> => {
      const { data } = await axios.get(url);
      return assessmentValidator.parse(data);
    },
    {
      enabled: hasStarted,
    },
  );
}

function useStartAssessment({ hasLoaded }: { hasLoaded: boolean }) {
  const url = `${endpoint}/start`;
  return useQuery(
    ['start'],
    async (): Promise<any> => {
      const { data } = await axios.post(url);
      return data;
    },
    {
      enabled: hasLoaded,
    },
  );
}

async function postAnswer(answer: AnswerPostData): Promise<any> {
  const url = `${endpoint}/answer`;
  return await axios.post(url, answer);
}

export const LearningStyle = () => {
  // state
  const [counter, setCounter] = useState(0);
  const [userStarted, setUserStarted] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | undefined>();

  // queries & hooks
  const { isSuccess: hasLoaded, ...queryAssessment } = useAssessmentQA({
    hasStarted: userStarted,
  });
  const queryStartAssessment = useStartAssessment({ hasLoaded });
  const submitAnswer = useMutation(postAnswer, {
    onSuccess: (data, variables) => {
      console.info('submitted answer', variables, 'with response', data);
      setCounter(counter + 1);
      setCurrentResponse(undefined);
    },
  });
  const { t } = useTranslation();

  // reference values
  const { answers, questions } = queryAssessment.data || initialAssessmentData;
  const isActive = hasLoaded && queryStartAssessment.isSuccess;
  const isSaving = submitAnswer.isLoading;

  // calulated values
  const progressPercent = useMemo(() => {
    if (counter < 1) return 0;
    return Math.round((counter / questions.length) * 100) - 1;
  }, [counter, questions]);
  const currentQuestion = useMemo(
    () => questions.find(q => q.order === counter),
    [counter, questions],
  );

  // event handlers
  const handleStart = () => {
    if (userStarted) return;
    setUserStarted(true);
    setCounter(1);
  };
  const handleResponse = (value: string) => {
    setCurrentResponse(value);
  };
  const handleNext = () => {
    if (!currentResponse || isSaving) return;
    submitAnswer.mutate({ questionOrder: counter, response: currentResponse });
  };

  /**
   * initial component to begin the assessment
   */
  const AssessmentBegin = () => (
    <Button onClick={handleStart} variant="filled" loading={userStarted}>
      {t('label.start')}
    </Button>
  );

  /**
   * active assessment component
   */
  const Assessment = () => (
    <>
      <Stack spacing="xl" sx={{ marginTop: 50, marginBottom: 38 }}>
        <ProgressBar label={t('label.progress')} percent={progressPercent} />
        <Text size="lg" align="center">
          {currentQuestion?.text}
        </Text>
        <RadioGroup value={currentResponse} onChange={handleResponse} size="md">
          {answers?.map(radio => (
            <Radio
              value={`${radio.value}`}
              label={radio.text}
              key={radio.value}
            />
          ))}
        </RadioGroup>
      </Stack>

      <Button
        variant="filled"
        onClick={handleNext}
        disabled={!currentResponse}
        loading={isSaving}
      >
        {t('label.next')}
      </Button>
    </>
  );

  return isActive ? <Assessment /> : <AssessmentBegin />;
};
