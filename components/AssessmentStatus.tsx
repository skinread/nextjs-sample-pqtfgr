import { Box, Group, Stepper } from '@mantine/core';
import { useTranslation } from 'next-i18next';

export const AssesmentStatus = () => {
  const { t } = useTranslation();
  return (
    <Box component="section" sx={{ marginBottom: 50, marginTop: 75 }}>
      <Group position="apart">
        <Stepper.Step
          label={t('assessment.culture-fit')}
          state="stepInactive"
          allowStepClick={false}
        >
          Culture fit
        </Stepper.Step>
        <Stepper.Step
          label={t('assessment.aptitude')}
          state="stepInactive"
          allowStepClick={false}
        >
          Aptitude
        </Stepper.Step>
        <Stepper.Step
          label={t('assessment.psychometric')}
          state="stepInactive"
          allowStepClick={false}
        >
          Psychometric
        </Stepper.Step>
        <Stepper.Step
          label={t('assessment.learning-style')}
          state="stepProgress"
          allowStepClick={false}
        >
          Learning style
        </Stepper.Step>
      </Group>
    </Box>
  );
};
