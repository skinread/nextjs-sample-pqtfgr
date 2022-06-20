import { Box, Group, Stepper } from '@mantine/core';

export const AssesmentStatus = () => (
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
