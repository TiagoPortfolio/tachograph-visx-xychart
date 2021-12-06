import React, { useMemo, useRef, useState, useEffect } from "react";

import { scaleLinear, scaleBand } from "@visx/scale";
import {
  // animated
  Axis,
  Grid,
  LineSeries,
  XYChart
} from "@visx/xychart";
import { curveStepAfter, curveStep, curveStepBefore } from "@visx/curve";
import { Brush } from "@visx/brush";
import { PatternLines } from "@visx/pattern";

import { Bounds } from "@visx/brush/lib/types";

import BaseBrush from "@visx/brush/lib/BaseBrush";
import moment from "moment";

export type XYChartProps = {
  width: number;
  height: number;
};

type TachographDriverActivity =
  | "AVAILABLE"
  | "DRIVING"
  | "REST"
  | "OTHER_WORK"
  | "UNKNOWN";

type ChartData = {
  status: TachographDriverActivity;
  pct: number;
  start: {
    hours: number;
    formatted: string;
    humanized: string;
  };
  end: {
    hours: number;
    formatted: string;
    humanized: string;
  };
  duration: string;
  id: number;
};

const formatDurationWithHourMinute = (hours: number) => {
  const duration = moment.duration(hours, "hours");
  const formattedHour = Math.floor(duration.asHours());
  return `${(formattedHour < 10 ? "0" : "") + formattedHour}:${(
    "0" + duration.minutes()
  ).slice(-2)}`;
};

const data: ChartData[] = [
  {
    status: "REST",
    pct: 0,
    start: {
      hours: 0,
      formatted: "0:00",
      humanized: ""
    },
    end: {
      hours: 5.566666666666666,
      formatted: "5:34",
      humanized: "5 hours 34 minutes"
    },
    duration: "5h 34m ",
    id: 0
  },
  {
    status: "REST",
    pct: 5.566666666666666,
    start: {
      hours: 5.566666666666666,
      formatted: "5:34",
      humanized: "5 hours 34 minutes"
    },
    end: {
      hours: 5.616666666666666,
      formatted: "5:37",
      humanized: "5 hours 37 minutes"
    },
    duration: " 3m ",
    id: 1
  },
  {
    status: "DRIVING",
    pct: 5.616666666666666,
    start: {
      hours: 5.616666666666666,
      formatted: "5:37",
      humanized: "5 hours 37 minutes"
    },
    end: {
      hours: 5.8,
      formatted: "5:48",
      humanized: "5 hours 48 minutes"
    },
    duration: " 11m ",
    id: 2
  },
  {
    status: "OTHER_WORK",
    pct: 5.8,
    start: {
      hours: 5.8,
      formatted: "5:48",
      humanized: "5 hours 48 minutes"
    },
    end: {
      hours: 6.016666666666667,
      formatted: "6:01",
      humanized: "6 hours 1 minute"
    },
    duration: " 13m ",
    id: 3
  },
  {
    status: "DRIVING",
    pct: 6.016666666666667,
    start: {
      hours: 6.016666666666667,
      formatted: "6:01",
      humanized: "6 hours 1 minute"
    },
    end: {
      hours: 6.033333333333333,
      formatted: "6:02",
      humanized: "6 hours 2 minutes"
    },
    duration: " 1m ",
    id: 4
  },
  {
    status: "OTHER_WORK",
    pct: 6.033333333333333,
    start: {
      hours: 6.033333333333333,
      formatted: "6:02",
      humanized: "6 hours 2 minutes"
    },
    end: {
      hours: 6.116666666666666,
      formatted: "6:07",
      humanized: "6 hours 7 minutes"
    },
    duration: " 5m ",
    id: 5
  },
  {
    status: "DRIVING",
    pct: 6.116666666666666,
    start: {
      hours: 6.116666666666666,
      formatted: "6:07",
      humanized: "6 hours 7 minutes"
    },
    end: {
      hours: 6.916666666666667,
      formatted: "6:55",
      humanized: "6 hours 55 minutes"
    },
    duration: " 48m ",
    id: 6
  },
  {
    status: "OTHER_WORK",
    pct: 6.916666666666667,
    start: {
      hours: 6.916666666666667,
      formatted: "6:55",
      humanized: "6 hours 55 minutes"
    },
    end: {
      hours: 7,
      formatted: "7:00",
      humanized: "7 hours"
    },
    duration: " 5m ",
    id: 7
  },
  {
    status: "DRIVING",
    pct: 7,
    start: {
      hours: 7,
      formatted: "7:00",
      humanized: "7 hours"
    },
    end: {
      hours: 8.316666666666666,
      formatted: "8:19",
      humanized: "8 hours 19 minutes"
    },
    duration: "1h 19m ",
    id: 8
  },
  {
    status: "OTHER_WORK",
    pct: 8.316666666666666,
    start: {
      hours: 8.316666666666666,
      formatted: "8:19",
      humanized: "8 hours 19 minutes"
    },
    end: {
      hours: 8.35,
      formatted: "8:21",
      humanized: "8 hours 21 minutes"
    },
    duration: " 2m ",
    id: 9
  },
  {
    status: "DRIVING",
    pct: 8.35,
    start: {
      hours: 8.35,
      formatted: "8:21",
      humanized: "8 hours 21 minutes"
    },
    end: {
      hours: 8.933333333333334,
      formatted: "8:56",
      humanized: "8 hours 56 minutes"
    },
    duration: " 35m ",
    id: 10
  },
  {
    status: "OTHER_WORK",
    pct: 8.933333333333334,
    start: {
      hours: 8.933333333333334,
      formatted: "8:56",
      humanized: "8 hours 56 minutes"
    },
    end: {
      hours: 8.966666666666667,
      formatted: "8:58",
      humanized: "8 hours 58 minutes"
    },
    duration: " 2m ",
    id: 11
  },
  {
    status: "DRIVING",
    pct: 8.966666666666667,
    start: {
      hours: 8.966666666666667,
      formatted: "8:58",
      humanized: "8 hours 58 minutes"
    },
    end: {
      hours: 9.033333333333333,
      formatted: "9:02",
      humanized: "9 hours 2 minutes"
    },
    duration: " 4m ",
    id: 12
  },
  {
    status: "REST",
    pct: 9.033333333333333,
    start: {
      hours: 9.033333333333333,
      formatted: "9:02",
      humanized: "9 hours 2 minutes"
    },
    end: {
      hours: 9.133333333333333,
      formatted: "9:08",
      humanized: "9 hours 8 minutes"
    },
    duration: " 6m ",
    id: 13
  },
  {
    status: "DRIVING",
    pct: 9.133333333333333,
    start: {
      hours: 9.133333333333333,
      formatted: "9:08",
      humanized: "9 hours 8 minutes"
    },
    end: {
      hours: 9.15,
      formatted: "9:09",
      humanized: "9 hours 9 minutes"
    },
    duration: " 1m ",
    id: 14
  },
  {
    status: "OTHER_WORK",
    pct: 9.15,
    start: {
      hours: 9.15,
      formatted: "9:09",
      humanized: "9 hours 9 minutes"
    },
    end: {
      hours: 9.316666666666666,
      formatted: "9:19",
      humanized: "9 hours 19 minutes"
    },
    duration: " 10m ",
    id: 15
  },
  {
    status: "REST",
    pct: 9.316666666666666,
    start: {
      hours: 9.316666666666666,
      formatted: "9:19",
      humanized: "9 hours 19 minutes"
    },
    end: {
      hours: 9.583333333333334,
      formatted: "9:35",
      humanized: "9 hours 35 minutes"
    },
    duration: " 16m ",
    id: 16
  },
  {
    status: "DRIVING",
    pct: 9.583333333333334,
    start: {
      hours: 9.583333333333334,
      formatted: "9:35",
      humanized: "9 hours 35 minutes"
    },
    end: {
      hours: 9.616666666666667,
      formatted: "9:37",
      humanized: "9 hours 37 minutes"
    },
    duration: " 2m ",
    id: 17
  },
  {
    status: "REST",
    pct: 9.616666666666667,
    start: {
      hours: 9.616666666666667,
      formatted: "9:37",
      humanized: "9 hours 37 minutes"
    },
    end: {
      hours: 13.133333333333333,
      formatted: "13:08",
      humanized: "13 hours 8 minutes"
    },
    duration: "3h 31m ",
    id: 18
  },
  {
    status: "OTHER_WORK",
    pct: 13.133333333333333,
    start: {
      hours: 13.133333333333333,
      formatted: "13:08",
      humanized: "13 hours 8 minutes"
    },
    end: {
      hours: 13.166666666666666,
      formatted: "13:10",
      humanized: "13 hours 10 minutes"
    },
    duration: " 2m ",
    id: 19
  },
  {
    status: "DRIVING",
    pct: 13.166666666666666,
    start: {
      hours: 13.166666666666666,
      formatted: "13:10",
      humanized: "13 hours 10 minutes"
    },
    end: {
      hours: 14.283333333333333,
      formatted: "14:17",
      humanized: "14 hours 17 minutes"
    },
    duration: "1h 7m ",
    id: 20
  },
  {
    status: "REST",
    pct: 14.283333333333333,
    start: {
      hours: 14.283333333333333,
      formatted: "14:17",
      humanized: "14 hours 17 minutes"
    },
    end: {
      hours: 15.2,
      formatted: "15:12",
      humanized: "15 hours 12 minutes"
    },
    duration: " 55m ",
    id: 21
  },
  {
    status: "DRIVING",
    pct: 15.2,
    start: {
      hours: 15.2,
      formatted: "15:12",
      humanized: "15 hours 12 minutes"
    },
    end: {
      hours: 15.216666666666667,
      formatted: "15:13",
      humanized: "15 hours 13 minutes"
    },
    duration: " 1m ",
    id: 22
  },
  {
    status: "OTHER_WORK",
    pct: 15.216666666666667,
    start: {
      hours: 15.216666666666667,
      formatted: "15:13",
      humanized: "15 hours 13 minutes"
    },
    end: {
      hours: 15.366666666666667,
      formatted: "15:22",
      humanized: "15 hours 22 minutes"
    },
    duration: " 9m ",
    id: 23
  },
  {
    status: "DRIVING",
    pct: 15.366666666666667,
    start: {
      hours: 15.366666666666667,
      formatted: "15:22",
      humanized: "15 hours 22 minutes"
    },
    end: {
      hours: 15.383333333333333,
      formatted: "15:23",
      humanized: "15 hours 23 minutes"
    },
    duration: " 1m ",
    id: 24
  },
  {
    status: "REST",
    pct: 15.383333333333333,
    start: {
      hours: 15.383333333333333,
      formatted: "15:23",
      humanized: "15 hours 23 minutes"
    },
    end: {
      hours: 16.066666666666666,
      formatted: "16:04",
      humanized: "16 hours 4 minutes"
    },
    duration: " 41m ",
    id: 25
  },

  {
    status: "DRIVING",
    pct: 16.066666666666666,
    start: {
      hours: 16.066666666666666,
      formatted: "16:04",
      humanized: "16 hours 4 minutes"
    },
    end: {
      hours: 18.333333333333332,
      formatted: "18:20",
      humanized: "18 hours 20 minutes"
    },
    duration: "2h 16m ",
    id: 26
  },
  {
    status: "OTHER_WORK",
    pct: 18.333333333333332,
    start: {
      hours: 18.333333333333332,
      formatted: "18:20",
      humanized: "18 hours 20 minutes"
    },
    end: {
      hours: 18.383333333333333,
      formatted: "18:23",
      humanized: "18 hours 23 minutes"
    },
    duration: " 3m ",
    id: 27
  },
  {
    status: "DRIVING",
    pct: 18.383333333333333,
    start: {
      hours: 18.383333333333333,
      formatted: "18:23",
      humanized: "18 hours 23 minutes"
    },
    end: {
      hours: 18.566666666666666,
      formatted: "18:34",
      humanized: "18 hours 34 minutes"
    },
    duration: " 11m ",
    id: 28
  },
  {
    status: "REST",
    pct: 18.566666666666666,
    start: {
      hours: 18.566666666666666,
      formatted: "18:34",
      humanized: "18 hours 34 minutes"
    },
    end: {
      hours: 24,
      formatted: "24:00",
      humanized: "24 hours"
    },
    duration: "5h 26m ",
    id: 29
  },
  {
    status: "REST",
    pct: 24,
    start: {
      hours: 18.566666666666666,
      formatted: "18:34",
      humanized: "18 hours 34 minutes"
    },
    end: {
      hours: 24,
      formatted: "24:00",
      humanized: "24 hours"
    },
    duration: "5h 26m ",
    id: 30
  }
];

const getPCT = (d: ChartData) => d.start.hours;
const getPCTEnd = (d: ChartData) => d.end.hours;
const getStatus = (d: ChartData) => {
  return d.status;
};

const accessors = {
  x: getPCT,
  y: getStatus
};

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const compact = true;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
export const accentColor = "#F47735";
export const background = "#584153";
export const background2 = "#af8baf";

const chartMargin = { top: 25, right: 25, bottom: 25, left: 50 };
const brushContainerHeight = 100;
const brushBaseColor = "steelblue";

export default function Example({
  width,
  height
}: {
  width: number;
  height: number;
}) {
  const [xDomain, setXDomain] = useState([0, 24]);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;

    setXDomain([Math.max(0, x0), x1]);
  };

  /* On initialization, "width" prop will be __zero__ so the first calculation returns a negative number. To account for this, we set a min brushMaxWidth of __zero__ */
  const brushMaxWidth = Math.max(
    width - chartMargin.right - chartMargin.left,
    0
  );

  const brushXScale = useMemo(() => {
    const range = [0, brushMaxWidth];

    return scaleLinear({
      range,
      domain: [0, 24]
    });
  }, [brushMaxWidth]);

  const initialBrushPosition = useMemo(
    () => ({
      start: {
        x: 0
      },
      end: {
        x: brushMaxWidth
      }
    }),
    [brushMaxWidth]
  );

  const brushYScale = useMemo(() => scaleBand(), []);

  return (
    <>
      <XYChart
        xScale={{
          type: "linear",
          zero: false,
          domain: xDomain
        }}
        yScale={{
          type: "band",
          domain: ["UNKNOWN", "REST", "AVAILABLE", "OTHER_WORK", "DRIVING"],
          padding: 1
        }}
        width={width}
        height={300}
        margin={chartMargin}
      >
        <Grid
          key={`grid-center`} // force animate on update
          rows={true}
          columns={true}
          lineStyle={{ stroke: "#ccc", strokeWidth: 1 }}
        ></Grid>

        <LineSeries
          dataKey="pct"
          data={data}
          stroke="#F47735"
          strokeWidth={3}
          xAccessor={accessors.x}
          yAccessor={accessors.y}
          curve={curveStepAfter}
          width={width}
        />

        <Axis
          orientation={"bottom"}
          stroke="#ccc"
          strokeWidth={1}
          hideTicks
          tickFormat={() => undefined}
        />
        <Axis
          key={`time-axis-center`}
          orientation={"top"}
          tickFormat={formatDurationWithHourMinute}
          stroke="#ccc"
          labelOffset={1000}
          strokeWidth={1}
          hideTicks
        ></Axis>

        <g>
          <rect
            x={width - 23}
            y={25}
            width={55}
            height={height}
            fill={"white"}
          ></rect>
        </g>
        <Axis
          key={`temp-axis-center`}
          orientation={"left"}
          stroke="#ccc"
          tickComponent={({ x, y }) => {
            return (
              <>
                <g>
                  <rect
                    x={x - 50}
                    y={y - 25}
                    width={55}
                    height={45}
                    fill={"white"}
                  ></rect>
                </g>
                <g>
                  <text x={x - 20} y={y + 5} fill={"black"}>
                    O
                  </text>
                </g>
              </>
            );
          }}
        />
      </XYChart>

      <svg
        style={{
          marginLeft: chartMargin.left,
          marginRight: chartMargin.right,
          height: brushContainerHeight,
          width
        }}
      >
        <XYChart
          xScale={{
            type: "linear",
            zero: false,
            domain: [0, 24]
          }}
          yScale={{
            type: "band",
            domain: ["UNKNOWN", "REST", "AVAILABLE", "OTHER_WORK", "DRIVING"],
            padding: 1
          }}
          width={brushMaxWidth}
          height={brushContainerHeight}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <LineSeries
            dataKey="pct"
            data={data}
            stroke="#F47735"
            strokeWidth={3}
            xAccessor={accessors.x}
            yAccessor={accessors.y}
            curve={curveStepAfter}
            width={brushMaxWidth}
          />
        </XYChart>

        <PatternLines
          id={PATTERN_ID}
          height={8}
          width={8}
          stroke={accentColor}
          strokeWidth={1}
          orientation={["diagonal"]}
        />
        <Brush
          key={brushMaxWidth}
          xScale={brushXScale}
          yScale={brushYScale}
          width={brushMaxWidth}
          height={brushContainerHeight}
          resizeTriggerAreas={["left", "right"]}
          initialBrushPosition={initialBrushPosition}
          onChange={onBrushChange}
          handleSize={16}
          selectedBoxStyle={{
            fill: `url(#${PATTERN_ID})`,
            stroke: "gray"
          }}
          useWindowMoveEvents
        />
      </svg>
    </>
  );
}
