

import { IFPSCoreReactComponentProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentProps';
import { IFPSCorePinMeReactComponentState } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentState';

import { ILoadPerformance } from '../fpsReferences';
import { IPhotoFormForm } from './Forms/PasteCoMash';
import { IAxisMap, IPhotoButtonStyle } from './Forms/IScatterChartProps';

export type IDefSourceType = 'lists...' | '' | '' | '' | '' | '*';

export type IDefaultFormTab = 'Input' | 'List' | 'Map';

export interface IFpsPhotoFormProps  extends IFPSCoreReactComponentProps, IPhotoFormForm {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  performance: ILoadPerformance;
  tab: IDefaultFormTab;
  axisMap: IAxisMap;

  photoButtonStyles: IPhotoButtonStyle[];
}

/**
 * Extends IFPSCorePinMeReactComponentState with all basics required for FPS Banner
 */
 export interface IFpsPhotoFormState extends IFPSCorePinMeReactComponentState {
  tab: IDefaultFormTab;
}
