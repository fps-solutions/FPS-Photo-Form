/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneToggle,
  IPropertyPaneField,
  // PropertyPaneTextField,
} from '@microsoft/sp-property-pane';

// import * as strings from 'PivotTiles20WebPartStrings';

import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';

export function buildEasyModeGroup( thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const thisProps: any = thisWPClass.properties as IFpsPhotoFormWebPartProps;
  // const { enableTabs } = thisProps;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  // const propsEasyMode: boolean = thisProps.propsEasyMode;

  groupFields.push(
    // propsEasyMode
    PropertyPaneToggle('propsEasyMode', {
      label: 'Easy Mode - Property Pane options',
      onText: 'Easy Mode - Keep it simple mode',
      offText : 'Complex - All options',
    }));

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Easy Mode properties`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
