import React from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import useActivities from 'src/hooks/useActivities';
import { MAIN_COLOR, yellow, blue } from 'src/utils/const';

// export const background = '#612efb';
const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };
// accessors
const getDate = (d) => d.date;

export default function GroupBar({ width, height, margin = defaultMargin }) {
  const { activities } = useActivities();
  if (width < 10) return null;
  if (!activities) return null;
  let data = {};
  const keys = ['Run', 'Hike', 'Ride'];
  let maxDistance = 0;
  activities.map((a) => {
    const month = a.start_date_local.slice(0, 7);
    if (!data[month]) {
      data[month] = {
        date: month,
        Run: 0,
        Hike: 0,
        Ride: 0,
      };
    }
    data[month][a.type] += a.distance;
    if (maxDistance < data[month][a.type]) maxDistance = data[month][a.type];
  });
  data = Object.values(data);

  // scales
  const dateScale = scaleBand({
    domain: data.map(getDate),
    padding: 0.2,
  });
  const cityScale = scaleBand({
    domain: keys,
    padding: 0.1,
  });
  const distanceScale = scaleLinear({
    domain: [0, maxDistance],
  });
  const colorScale = scaleOrdinal({
    domain: keys,
    range: [yellow, MAIN_COLOR, blue],
  });

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  distanceScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        rx={14}
      />
      <Group top={margin.top} left={margin.left}>
        <BarGroup
          data={data}
          keys={keys}
          height={yMax}
          x0={getDate}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={distanceScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => {
              console.log(barGroup);
              return (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map((bar) => (
                    <rect
                      key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      rx={1}
                    />
                  ))}
                </Group>
              );
            })
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        scale={dateScale}
        stroke={MAIN_COLOR}
        tickStroke={MAIN_COLOR}
        hideAxisLine
        tickLabelProps={() => ({
          fill: MAIN_COLOR,
          fontSize: 11,
          textAnchor: 'middle',
        })}
      />
    </svg>
  );
}
