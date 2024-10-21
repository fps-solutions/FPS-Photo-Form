

import { IFPSCoreReactComponentProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentProps';
import { IFPSCorePinMeReactComponentState } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentState';

import { ILoadPerformance } from '../fpsReferences';
import { IPhotoFormForm } from './Forms/PasteCoMash';

export type IDefSourceType = 'lists...' | '' | '' | '' | '' | '*';

export interface IFpsPhotoFormProps  extends IFPSCoreReactComponentProps, IPhotoFormForm {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  performance: ILoadPerformance;

}

/**
 * Extends IFPSCorePinMeReactComponentState with all basics required for FPS Banner
 */
 export interface IFpsPhotoFormState extends IFPSCorePinMeReactComponentState {


}
