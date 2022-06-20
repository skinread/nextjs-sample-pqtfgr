import axios from 'axios';
import { useState } from 'react';
import {
  Box,
  Button,
  Text,
  RadioGroup,
  Radio,
  Progress,
  Stack,
} from '@mantine/core';
import useAssessment from '../hooks/useAssessment';

export const host =
  'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io/';
export const endpoints = {
  load: 'assessment',
  start: 'start',
  submit: 'answer',
  current: 'current',
};

export const LearningStyle = () => {
  const [currentResponse, setCurrentResponse] = useState<string | undefined>();
  const {
    dispatch,
    answers,
    counter,
    hasStarted,
    isLoaded,
    isSaving,
    currentQuestion,
    progressPercent,
  } = useAssessment();

  const doLoad = () => {
    axios
      .get(`${host}${endpoints.load}`)
      .then((response) => {
        const { questions, answers } = response.data;
        dispatch({ type: 'LOAD', payload: { questions, answers } });
        doStart();
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const doStart = () => {
    dispatch({ type: 'START' });
    axios
      .post(`${host}${endpoints.start}`)
      .then((response) => {
        const { answers, startDate } = response.data;
        console.info('assessment started', startDate, answers);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const submitAnswer = (order: number, response: string) => {
    dispatch({ type: 'SAVING' });
    console.info(`sending response ${response} for quesiton #${order}`);
    axios
      .post(`${host}${endpoints.submit}`, {
        questionOrder: order,
        response,
      })
      .then((response) => {
        setCurrentResponse(undefined);
        dispatch({ type: 'NEXT' });
      })
      .catch((error) => console.warn(error));
  };

  const handleStart = () => {
    if (hasStarted) return;
    doLoad();
  };

  const handleResponse = (value: string) => {
    setCurrentResponse(value);
  };

  const handleNext = () => {
    if (isSaving || !currentResponse) return;
    submitAnswer(counter, currentResponse);
  };

  const BeforeStart = () => (
    <Button onClick={handleStart} variant="filled" loading={hasStarted}>
      Start
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
          {currentQuestion.text}
        </Text>

        <RadioGroup value={currentResponse} onChange={handleResponse} size="md">
          {answers.map((radio) => (
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
        Next
      </Button>
    </>
  );

  return isLoaded ? <Assessment /> : <BeforeStart />;
};
