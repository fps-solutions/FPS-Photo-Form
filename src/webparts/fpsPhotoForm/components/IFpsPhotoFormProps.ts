

import { IFPSCoreReactComponentProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentProps';
import { IFPSCorePinMeReactComponentState } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentState';
import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IFPSTileElementExtras, IFPSTileElementProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FPSTile/IFPSTileElementProps';

import { ILoadPerformance } from '../fpsReferences';
import { IPhotoFormForm } from './Forms/PasteFormForm';
import { IAxisMap, IChartTabProps, IPhotoButtonStyle } from './Forms/IScatterChartProps';
import { IFileDropBoxProps } from './Forms/FileDropBox/fps-FileDropBox';

export type IDefSourceType = 'lists...' | '' | '' | '' | '' | '*';

export type IDefaultFormTab = 'Input' | 'List' | 'Geo' | 'Camera' | 'Multi-Paste' | 'Files' | 'Map';

export interface IFpsPhotoFormProps  extends IFPSCoreReactComponentProps, IPhotoFormForm {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  performance: ILoadPerformance;
  tab: IDefaultFormTab;
  axisMap: IAxisMap;
  chartDisplay: IChartTabProps;

  fileDropBoxProps: IFileDropBoxProps;
  photoButtonStyles: IPhotoButtonStyle[];

  FPSItem: IFPSItem;
  eleExtras: IFPSTileElementExtras;
  eleProps: IFPSTileElementProps;

}

/**
 * Extends IFPSCorePinMeReactComponentState with all basics required for FPS Banner
 */
 export interface IFpsPhotoFormState extends IFPSCorePinMeReactComponentState {
  view: 'Normal' | 'Experimental';
  tab: IDefaultFormTab;
}
