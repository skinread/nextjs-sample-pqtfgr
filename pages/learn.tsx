import { Box, Text, Title } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { AssesmentStatus } from '../components/AssessmentStatus';
import { LearningStyle } from '../components/LearningStyle';
import type { NextPage } from 'next';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['learningstyle'])),
      // Will be passed to the page component as props
    },
  };
}

const Learn: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <AssesmentStatus />
      <Title order={1} sx={{ marginBottom: '.5em' }}>
        {t('learningstyle:title')}
      </Title>
      <Text size="sm">{t('learningstyle:intro-a')}</Text>
      <Text size="sm" sx={{ marginTop: '.5em' }}>
        {t('learningstyle:intro-b')}
      </Text>
      <Box component="main" sx={{ marginTop: 24 }}>
        <LearningStyle />
      </Box>
    </>
  );
};

export default Learn;
