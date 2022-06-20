import { Box, Text, Title } from '@mantine/core';
import { AssesmentStatus } from '../components/AssessmentStatus';
import { LearningStyle } from '../components/LearningStyle';
import type { NextPage } from 'next';

const Learn: NextPage = () => {
  return (
    <>
      <AssesmentStatus />
      <Title order={1} sx={{ marginBottom: '.5em' }}>
        Learning style
      </Title>
      <Text size="sm">
        This WithYouWithMe test will help you better understand which way you
        like to learn. We all learn differently - some of us prefer to learn
        through touch, others through sound or sight. This test will help
        highlight what’s your individual style.
      </Text>
      <Text size="sm" sx={{ marginTop: '.5em' }}>
        It is strongly recommended that you are in a quiet environment to avoid
        distractions and use a stable Internet connection when taking tests.
      </Text>
      <Box component="main" sx={{ marginTop: 24 }}>
        <LearningStyle />
      </Box>
    </>
  );
};

export default Learn;
