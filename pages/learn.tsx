import { useReducer, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Group,
  Progress,
  RadioGroup,
  Radio,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import type { NextPage } from 'next';

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

const host = 'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io/';
const endpoints = {
  load: 'assessment',
  start: 'start',
  submit: 'answer',
  current: 'current',
};

const defaultQuestion: QuestionType = { text: '', order: 0, category: '' };

const Learn: NextPage = () => {
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [counter, setCounter] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userReponse, setUserResponse] = useState<string | undefined>(
    undefined
  );

  const currentQuestion = () =>
    questions.find((q) => q.order === counter) || defaultQuestion;
  const progressPercent = () => {
    if (!isLoaded) return 0;
    return Math.round((counter / questions.length) * 100) - 1;
  };

  const handleStart = async () => {
    if (hasStarted) return;
    setHasStarted(true);

    // load assessment
    axios
      .get(`${host}${endpoints.load}`)
      .then((response) => {
        const { questions, answers } = response.data;
        setQuestions(questions);
        setAnswers(answers);
      })
      .catch((error) => {
        console.warn(error);
      });

    // call start api
    axios
      .post(`${host}${endpoints.start}`)
      .then((response) => {
        const { answers, startDate } = response.data;
        console.info('assessment started', startDate, answers);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

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

  const TheSteps = () => (
    <Box component="section" sx={{ marginBottom: 50, marginTop: 75 }}>
      <Group position="apart">
        <Stepper.Step
          label="Culuture Fit"
          state="stepInactive"
          allowStepClick={false}
        >
          Culture fit
        </Stepper.Step>
        <Stepper.Step
          label="Aptitude"
          state="stepInactive"
          allowStepClick={false}
        >
          Aptitude
        </Stepper.Step>
        <Stepper.Step
          label="Psychometric"
          state="stepInactive"
          allowStepClick={false}
        >
          Psychometric
        </Stepper.Step>
        <Stepper.Step
          label="Learning Style"
          state="stepProgress"
          allowStepClick={false}
        >
          Learning style
        </Stepper.Step>
      </Group>
    </Box>
  );

  const TheStart = () => (
    <Button onClick={handleStart} variant="filled" loading={hasStarted}>
      Start
    </Button>
  );
  const TheQuestion = () => (
    <>
      <Stack spacing="xl" sx={{ marginTop: 50, marginBottom: 38 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Text sx={{ marginRight: 24 }}>Progress</Text>
          <Progress
            value={progressPercent()}
            radius="md"
            sx={{ flexGrow: 1 }}
          />
          <Text sx={{ marginLeft: 12 }}>{progressPercent()}%</Text>
        </Box>

        <Text size="lg" align="center">
          {currentQuestion().text}
        </Text>

        <RadioGroup value={userReponse} onChange={setUserResponse} size="md">
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
        disabled={!userReponse}
        loading={isSaving}
      >
        Next
      </Button>
    </>
  );

  return (
    <>
      <TheSteps />
      <main>
        <Title order={1} sx={{ marginBottom: '.5em' }}>
          Learning style
        </Title>

        <Text size="sm">
          This WithYouWithMe test will help you better understand which way you
          like to learn. We all learn differently - some of us prefer to learn
          through touch, others through sound or sight. This test will help
          highlight what’s your individual style.
        </Text>
        <Text size="sm" sx={{ marginTop: '1em' }}>
          It is strongly recommended that you are in a quiet environment to
          avoid distractions and use a stable Internet connection when taking
          tests.
        </Text>
        {isLoaded && <TheQuestion />}
        {!isLoaded && <TheStart />}
      </main>
    </>
  );
};

export default Learn;
