/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneTextField,
  IPropertyPaneField,
  // PropertyPaneTextField,
} from '@microsoft/sp-property-pane';

import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';

export function buildMiscPropsGroup( thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  groupFields.push(
    // propsEasyMode
    ...[
      PropertyPaneTextField('defaultTab', {
        label: 'Default Tab',
        description: 'Input | List | Map',
      }),
    ]
  );

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Misc Photo Form`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
