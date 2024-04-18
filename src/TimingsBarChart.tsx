import React from 'react';
import { HoverCard } from '@mantine/core';

interface TimingProps {
  timings: {
    startTime: number;
    endTime: number;
    getCallsStart: number;
    getCallsEnd: number;
    beforeRequestStart: number;
    beforeRequestEnd: number;
    afterRequestStart: number;
    afterRequestEnd: number;
    validateCallStart: number;
    validateCallEnd: number;
    afterResponseStart: number;
    afterResponseEnd: number;
  };
}

const TimingsBarChart: React.FC<TimingProps> = ({ timings }) => {
  const totalTime = timings.endTime - timings.startTime;
  const minimumWidthPx = 10; // Minimum width in pixels for each bar
  const totalMinimumWidth = 5 * minimumWidthPx; // Adjust based on number of bars
  const availableWidth = totalTime - totalMinimumWidth;

  // Calculate the width of each bar
  const calculateWidth = (time: number) => {
    const timeWidth = availableWidth * (time / totalTime);
    return timeWidth + minimumWidthPx;
  };

  return (
    <div style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', maxWidth: 'calc(100% - 10px)' }}>
        {[
          { time: timings.getCallsEnd - timings.getCallsStart, label: 'getCalls', color: 'red' },
          { time: timings.beforeRequestEnd - timings.beforeRequestStart, label: 'beforeRequest', color: 'blue' },
          { time: timings.afterRequestEnd - timings.afterRequestStart, label: 'afterRequest', color: 'green' },
          { time: timings.validateCallEnd - timings.validateCallStart, label: 'validateCall', color: 'yellow' },
          { time: timings.afterResponseEnd - timings.afterResponseStart, label: 'afterResponse', color: 'purple' }
        ].map(({ time, label, color }) => (
          <div style={{ flex: `0 0 ${calculateWidth(time)}px` }} key={label}>
            <HoverCard width={220} position="bottom" withArrow shadow="md">
              <HoverCard.Target>
                <div style={{ backgroundColor: color, height: '30px', cursor: 'pointer' }} />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <div style={{ padding: 10 }}>
                  <strong>{label}</strong> {time}ms
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', backgroundColor: 'gray', padding: '10px', color: 'white', marginTop: '10px' }}>Total Time: {totalTime}ms</div>
    </div>
  );
};

export default TimingsBarChart;
