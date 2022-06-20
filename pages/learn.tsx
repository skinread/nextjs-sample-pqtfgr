import { useState } from 'react';
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
import useLearningStyle, {
  useAssessmentAnswer,
  useAssessmentLoad,
  useAssessmentStart,
} from '../hooks/useLearningStyle';
// import useLoadAssessment from '../hooks/useSampleFetch';
import type { NextPage } from 'next';

const Learn: NextPage = () => {
  const [userReponse, setUserResponse] = useState<string | undefined>();
  const {
    action,
    questions,
    answers,
    counter,
    hasStarted,
    isLoaded,
    isSaving,
    currentQuestion,
    progressPercent,
  } = useLearningStyle();

  const handleBegin = () => {
    if (hasStarted) return;

    action({ type: 'start' });
    const { questions, answers } = useAssessmentLoad();
    action({
      type: 'load',
      payload: {
        questions,
        answers,
      },
    });
    useAssessmentStart();
  };

  const handleResponse = (value: string) => {
    action({ type: 'answer', payload: { response: value } });
  };

  const handleNext = () => {
    if (isSaving) return;

    action({ type: 'next' });
    action({ type: 'saved' });
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
    <Button onClick={handleBegin} variant="filled" loading={hasStarted}>
      Start
    </Button>
  );
  const TheQuestion = () => (
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

        <RadioGroup value={userReponse} onChange={handleResponse} size="md">
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
