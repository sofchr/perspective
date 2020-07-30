/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

import * as fc from "d3fc";
import {transposeData} from "../data/transposeData";
import {axisFactory} from "../axis/axisFactory";
import {chartSvgFactory} from "../axis/chartFactory";
import {lineSeries} from "../series/lineSeries";
import {xySplitData} from "../data/xySplitData";
import {seriesColors} from "../series/seriesColors";
import {filterDataByGroup} from "../legend/filter";
import withGridLines from "../gridlines/gridlines";
import {hardLimitZeroPadding} from "../d3fc/padding/hardLimitZero";
import zoomableChart from "../zoom/zoomableChart";
import nearbyTip from "../tooltip/nearbyTip";

function xyLine(container, settings) {
    const data = transposeData(xySplitData(settings, filterDataByGroup(settings)));

    const color = seriesColors(settings);

    const series = fc
        .seriesSvgRepeat()
        .series(lineSeries(settings, color))
        .orient("horizontal");

    const paddingStrategy = hardLimitZeroPadding()
        .pad([0.1, 0.1])
        .padUnit("percent");

    const xAxisFactory = axisFactory(settings)
        .settingName("mainValues")
        .settingValue(settings.mainValues[0].name)
        .valueName("crossValue")
        .paddingStrategy(paddingStrategy);

    const yAxisFactory = axisFactory(settings)
        .settingName("mainValues")
        .settingValue(settings.mainValues[1].name)
        .valueName("mainValue")
        .orient("vertical")
        .paddingStrategy(paddingStrategy);

    const yAxis = yAxisFactory(data);
    const xAxis = xAxisFactory(data);

    const plotSeries = withGridLines(series, settings).orient("vertical");

    const chart = chartSvgFactory(xAxis, yAxis)
        .xLabel(settings.mainValues[0].name)
        .yLabel(settings.mainValues[1].name)
        .plotArea(plotSeries);

    chart.xNice && chart.xNice();
    chart.yNice && chart.yNice();

    const zoomChart = zoomableChart()
        .chart(chart)
        .settings(settings)
        .xScale(xAxis.scale)
        .yScale(yAxis.scale);

    const toolTip = nearbyTip()
        .settings(settings)
        .xScale(xAxis.scale)
        .yScale(yAxis.scale)
        .color(color)
        .data(data);

    container.datum(data).call(zoomChart);
    container.call(toolTip);
}

xyLine.plugin = {
    type: "d3_xy_line",
    name: "X/Y Line Chart",
    max_cells: 50000,
    max_columns: 50,
    initial: {
        type: "number",
        count: 2,
        names: ["X Axis", "Y Axis"]
    },
    selectMode: "toggle"
};

export default xyLine;
