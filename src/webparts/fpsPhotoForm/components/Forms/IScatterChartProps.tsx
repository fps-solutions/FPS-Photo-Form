import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IUnifiedPerformanceOps } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFpsErrorObject";
import { IAnySourceItem, IStateSource } from "../../fpsReferences";

export type ICustomScatterType = 'Normal' | 'MC';

export const changesAxis: string[] = [ 'type', 'Title', 'Comments', 'Category1', 'Category2', 'Category3', 'Color', 'Shape', 'horz', 'vert', 'depth' ].map( (str => `axis${str}`));

export interface IAxisMapWPProps {
  axistype: ICustomScatterType;
  axisTitle: string;
  axisComments: string;
  axisCategory1: string;
  axisCategory2: string;
  axisCategory3: string;
  axisColor: string;
  axisShape: string;
  axishorz: string; // raw item property key representing Horizontal Axis
  axisvert: string; // raw item property key representing Vertical Chart Axis
  axisdepth: string; // raw item property key representing Depth Axis
}

export interface IPhotoButtonStyle {
  label: string;
  styles: React.CSSProperties;
}

export interface IAxisMap {
  type: ICustomScatterType;
  Title: string;
  Comments: string;
  Category1: string;
  Category2: string;
  Category3: string;
  Color: string;
  Shape: string;
  horz: string; // raw item property key representing Horizontal Axis
  vert: string; // raw item property key representing Vertical Chart Axis
  depth: string; // raw item property key representing Depth Axis
}

export interface IScatterChartSettings {
  hCenter: number; // Center x coordinate
  vCenter: number; // Center y coordinate
  diameter: number; // Total height of the chart
  gridStep: number; // Step for grid lines
  reverseVerticalAxis?: boolean; // Flag to reverse the vertical axis
  axisMap: IAxisMap
}

export interface IScatterChartProps extends IScatterChartSettings {
  show?: boolean;
  Category1: string;
  stateSource: IStateSourceScatter;
}

export interface IStateSourceScatter extends IStateSource {
  // HAD TO ADD THESE first two to pass gulp lint errors even though it's already on IStateSource
  refreshId: string;
  unifiedPerformanceOps: IUnifiedPerformanceOps;
  items: IScatterSourceItem[];
}

// Extend IFPSItem to include the Scatter property
export interface IFPSItemWithScatter extends IFPSItem {
  Scatter: IScatterPlotItem; // Add the Scatter property here
}

// Create the IScatterSourceItem interface
export interface IScatterSourceItem extends Omit<IAnySourceItem, 'FPSItem'> {
  FPSItem: IFPSItemWithScatter; // Override FPSItem to include the Scatter property
}


export interface IScatterPlotItem {
  horz: number;
  vert: number;
  depth: number;
  Category1: string;
  Category2: string[];
  Category3: string[];
  Title: string;
  Shape: 'circle' | 'triangle' | 'square' | 'X' | '-' | 'image';
  Color: string;
}
