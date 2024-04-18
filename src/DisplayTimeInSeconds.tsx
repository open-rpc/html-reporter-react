import { Text } from '@mantine/core';

const DisplayTimeInSeconds = ({ time, style, ignoreColor, threshold }: any) => {
  const thresholdTime = threshold || 1;
  if (time > thresholdTime && !ignoreColor) {
    style.color = 'orange';
  } else if (ignoreColor){
    style.color = 'gray';
  } else {
    style.color = 'green';
  }
  return <Text style={style}>{time}s</Text>;
};

export default DisplayTimeInSeconds;
