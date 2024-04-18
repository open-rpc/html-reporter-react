import { Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconZoomReplace,
  IconABOff,
} from '@tabler/icons-react';
import classes from './ReportStats.module.css';
import { getPassingFailed, getPassingFailingMissedMethods } from './utils';


export function ReportStats({ report, onClick }: any) {
  const passingMethods = getPassingFailingMissedMethods(report);
  const { passing, failing } = getPassingFailed(report);
  const data = [
    { title: 'Passing', value: passingMethods.passing.length, diff: 0, secondary: passing.length },
    { title: 'Failing', value: passingMethods.failing.length, diff: 0, secondary: failing.length },
    { title: 'Missing', value: passingMethods.missing.length, diff: 0 },
  ];
  const stats = data.map((stat) => {
    const DiffIcon =
      stat.diff > 0
        ? IconArrowUpRight
        : stat.diff < 0
        ? IconArrowDownRight
        : IconABOff;

    let bg;
    switch (stat.title) {
      case 'Passing':
        bg = 'lightgreen';
        break;
      case 'Failing':
        bg = 'var(--mantine-color-red-4)';
        break;
      case 'Missing':
        bg = 'var(--mantine-color-gray-1)';
        break;
    }
    return (
      <Paper withBorder p="md" radius="md" key={stat.title} bg={bg} onClick={() => onClick(stat.title)} style={{cursor: 'pointer'}} component="a">
        <Group justify="apart">
          <div>
            <Text
              c="dimmed"
              tt="uppercase"
              fw={700}
              fz="xs"
              className={classes.label}
            >
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value} <Text c="dimmed" style={{display: 'inline'}}>methods</Text>
            </Text>
          </div>
          {stat.diff !== 0 && (
            <ThemeIcon
              color="gray"
              variant="light"
              style={{
                color:
                  stat.diff > 0
                    ? 'var(--mantine-color-teal-6)'
                    : stat.diff < 0
                    ? 'var(--mantine-color-red-6)'
                    : 'var(--mantine-color-gray-6)',
              }}
              size={38}
              radius="md"
            >
              <DiffIcon size="1.8rem" stroke={1.5} />
            </ThemeIcon>
          )}
        </Group>
        {stat.secondary && stat.secondary !== 0 && (
          <Text c="dimmed" fz="sm" mt="md">
            <b>{stat.secondary > 0 && stat.secondary}{' '}</b>
            tests
          </Text>
        )}
        {stat.diff !== 0 && (
          <Text c="dimmed" fz="sm" mt="md">
            <Text
              component="span"
              c={stat.diff > 0 ? 'teal' : stat.diff < 0 ? 'red' : 'gray'}
              fw={700}
            >
              {stat.diff}%
            </Text>{' '}
            {stat.diff > 0
              ? 'increase'
              : stat.diff < 0
              ? 'decrease'
              : 'No change'}{' '}
            compared to last run
          </Text>
        )}
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
    </div>
  );
}
