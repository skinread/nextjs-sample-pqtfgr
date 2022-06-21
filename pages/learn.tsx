import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Text, Title } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { AssesmentStatus } from '../components/AssessmentStatus';
import { LearningStyle } from '../components/LearningStyle';
import type { NextPage } from 'next';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'learningstyle'])),
      // Will be passed to the page component as props
    },
  };
}

const LanguageSwitcher = ({ currentLocale }: { currentLocale: string }) => (
  <Box sx={{ marginTop: 16 }}>
    {currentLocale.includes('en') && (
      <Link href="/learn" locale="fr">
        <Button variant="light">Français</Button>
      </Link>
    )}
    {currentLocale.includes('fr') && (
      <Link href="/learn" locale="en">
        <Button variant="light">English</Button>
      </Link>
    )}
  </Box>
);

const Learn: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <LanguageSwitcher currentLocale={router.locale} />
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
