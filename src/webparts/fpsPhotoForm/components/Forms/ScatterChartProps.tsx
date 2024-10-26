export interface ScatterChartProps {
  Category1: string;
  xCenter: number; // Center x coordinate
  yCenter: number; // Center y coordinate
  diameter: number; // Total height of the chart
  stateSource: IStateSource;
  gridStep: number; // Step for grid lines
  reverseVerticalAxis?: boolean; // Flag to reverse the vertical axis
  axisMap: {
    x: string; // raw item property key representing Horizontal Axis
    y: string; // raw item property key representing Vertical Chart Axis
    z: string; // raw item property key representing Depth Axis
  };
}

export interface IStateSource {
  items: IAnySourceItem[];
}

export interface IAnySourceItem {
  FPSItem: {
    Scatter: IScatterPlotItem;
  };
}

export interface IScatterPlotItem {
  x: number;
  y: number;
  z: number;
  Category: string;
  Title: string;
  Shape: 'circle' | 'triangle' | 'square' | 'X' | '-' | 'image';
  Color: string;
}
