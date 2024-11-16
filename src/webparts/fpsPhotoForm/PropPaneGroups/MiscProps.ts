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

import { PropertyPaneMultiSelectDropdown } from '../components/Dropdown/fps-PropPaneMultiSelectDropdown';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { IOffice365SpecificMIMENames, Office365MIMENAME, Office365MIMENAMES, Specific_MIME_DropdownOptions } from '../components/Forms/FileDropBox/fps-FileDropTypes';

export function buildMiscPropsGroup( wpProps: IFpsPhotoFormWebPartProps, thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

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
      label: 'Choose File Types',
      description: 'See Yellow Webpart Help for details',
      multiple: true,
      maxVsibleRows: 10,
      options: Specific_MIME_DropdownOptions,
      selectedKeys: wpProps.fileTypes || [],
      onChange: (newKeys: string[]) => {
        let cleanFileTypes: string[] = [];
        if ( newKeys.indexOf ( Office365MIMENAME ) > -1 ) {
          // Remove the specific Office one since you are now using the All option
          newKeys.map( key => { if ( Office365MIMENAMES.indexOf( key as IOffice365SpecificMIMENames ) < 0 ) cleanFileTypes.push( key ) })
        } else { cleanFileTypes = newKeys; }
        wpProps.fileTypes = cleanFileTypes;
        thisWPClass.refreshPaneReRender(); // Re-render web part to reflect changes
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
