/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneTextField,
  IPropertyPaneField,
  PropertyPaneToggle,
  // PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';

import { PropertyPaneMultiSelectDropdown } from '../components/Dropdown/fps-PropPaneMultiSelectDropdown';
import { IOffice365SpecificMIMENames, Office365MIMENAME, Office365MIMENAMES, Specific_MIME_DropdownOptions } from '../components/Forms/FileDropBox/fps-FileDropTypes';
import { IFileDropBoxWPProps } from '../components/Forms/FileDropBox/IFileDropBoxProps';
import { FileSizeScaleOptions, FileSizeScaleRegex } from '../components/Forms/FileDropBox/convertFileSizeStringToNum';


export function buildFileDropBoxGroup( wpProps: IFileDropBoxWPProps, thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  function validateFileSize(input: string): string {
    return FileSizeScaleRegex.test(input)
      ? '' // No error
      : 'Input must match the format: <number> <unit>, e.g., "10 MB".';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [

    PropertyPaneToggle('defaultPasteMode', {
      label: 'Mode',
      onText: 'Paste clipboard',
      offText: 'Select files',
    }),

    PropertyPaneTextField('fileWarnSize', {
      label: 'file Warn size (like 50 kb)',
      description: `valid scales: ${ FileSizeScaleOptions.join( ' | ')}`,
      onGetErrorMessage: validateFileSize,
    }),

    PropertyPaneTextField('fileMaxSize', {
      label: 'file Max size (like 1MB)',
      description: '',
      onGetErrorMessage: validateFileSize,
    }),

    PropertyPaneTextField('maxUploadCount', {
      label: 'Max upload count',
      description: '',
    }),
  ];

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
    groupName: `File Picker Settings`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
