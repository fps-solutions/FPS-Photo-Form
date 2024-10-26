export interface ScatterChartProps {
  show?: boolean;
  Category1: string;
  hCenter: number; // Center x coordinate
  vCenter: number; // Center y coordinate
  diameter: number; // Total height of the chart
  stateSource: IStateSource;
  gridStep: number; // Step for grid lines
  reverseVerticalAxis?: boolean; // Flag to reverse the vertical axis
  axisMap: {
    horz: string; // raw item property key representing Horizontal Axis
    vert: string; // raw item property key representing Vertical Chart Axis
    depth: string; // raw item property key representing Depth Axis
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
  horz: number;
  vert: number;
  depth: number;
  Category: string;
  Title: string;
  Shape: 'circle' | 'triangle' | 'square' | 'X' | '-' | 'image';
  Color: string;
}
