import { Box, Progress, Text } from '@mantine/core';

export function ProgressBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Text sx={{ marginRight: 24 }}>{label}</Text>
      <Progress value={percent} radius="md" sx={{ flexGrow: 1 }} />
      <Text sx={{ marginLeft: 12 }}>{percent}%</Text>
    </Box>
  );
}
