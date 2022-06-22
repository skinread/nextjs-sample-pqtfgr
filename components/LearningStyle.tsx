import axios from 'axios';
import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  Box,
  Button,
  Text,
  RadioGroup,
  Radio,
  Progress,
  Stack,
} from '@mantine/core';

const initialAssessmentData = {
  answers: [{
    value: 0,
    text: '',
  }],
  questions: [{
    text: '',
    order: 0,
    category: '',
  }]
};

type AssessmentData = typeof initialAssessmentData;
type AnswerPostData = {
  questionOrder: number;
  response: string;
}

const endpoint = 'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io';

function useAssessmentQA({ hasStarted }: { hasStarted: boolean }) {
  const url = `${endpoint}/assessment`;
  return useQuery(
    ['load'],
    async (): Promise<AssessmentData> => {
      const { data } = await axios.get(url);
      return data;
    },
    { 
      enabled: hasStarted
    }
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
      enabled: hasLoaded
    }
  );
}

const postAnswer = async (answer: AnswerPostData): Promise<any> => {
  const url = `${endpoint}/answer`;
  return await axios.post(url, answer);
};

export const LearningStyle = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<string | undefined>();
  
  const { data: assessmentData, isSuccess: hasLoaded } = useAssessmentQA({ hasStarted });
  const startAssessment = useStartAssessment({ hasLoaded });
  const submitAnswer = useMutation(postAnswer, {
    onSuccess: (data, variables) => {
      console.info('submitted answer', variables, 'with response', data);
      setCounter(counter + 1);
      setCurrentResponse(undefined);
    },
  });
  const { t } = useTranslation();
  
  const { answers, questions } = assessmentData || initialAssessmentData;
  const isActive = hasLoaded && startAssessment.isSuccess;
  const isSaving = submitAnswer.isLoading;
  
  const progressPercent = useMemo(() => {
    if (counter < 1) return 0;
    return Math.round((counter / questions.length) * 100) - 1;
  }, [counter, questions]);

  const currentQuestion = useMemo(
    () => questions.find(q => q.order === counter),
    [counter, questions],
  );

  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setCounter(1);
  };

  const handleResponse = (value: string) => {
    setCurrentResponse(value);
  };

  const handleNext = () => {
    if (!currentResponse || isSaving) return;
    submitAnswer.mutate({questionOrder: counter, response: currentResponse});
  };

  const AssessmentBegin = () => (
    <Button onClick={handleStart} variant="filled" loading={hasStarted}>
      {t('label.start')}
    </Button>
  );

  const Assessment = () => (
    <>
      <Stack spacing="xl" sx={{ marginTop: 50, marginBottom: 38 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Text sx={{ marginRight: 24 }}>Progress</Text>
          <Progress value={progressPercent} radius="md" sx={{ flexGrow: 1 }} />
          <Text sx={{ marginLeft: 12 }}>{progressPercent}%</Text>
        </Box>

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
