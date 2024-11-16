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
import { PropertyPaneMultiSelectDropdown } from '../components/Dropdown/fps-PropPaneMultiSelectDropdown';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { Specific_MIME_DropdownOptions } from '../components/Forms/FileDropBox/fps-FileDropTypes';

export function buildMiscPropsGroup( wpProps: IFpsPhotoFormWebPartProps, thisWP: any ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  groupFields.push(
    // propsEasyMode
    ...[
      PropertyPaneTextField('defaultTab', {
        label: 'Default Tab',
        description: 'Input | List | Map | Geo | Camera',
      }),
    ]
  );



  groupFields.push(

    PropertyPaneMultiSelectDropdown({
      key: 'fileTypes',
      label: 'Choose Options',
      options: Specific_MIME_DropdownOptions,
      selectedKeys: wpProps.fileTypes || [],
      onChange: (newKeys: string[]) => {
        wpProps.fileTypes = newKeys;
        thisWP.render(); // Re-render web part to reflect changes
      },
    }),

  );

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Misc Photo Form`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
