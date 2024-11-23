/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneTextField,
  IPropertyPaneField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  // PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { DefaultFormTabsProduction, DefaultFormTabsAll, PrefabFormTemplates } from '../components/IFpsPhotoFormProps';

import { JSON_Edit_Link } from '../fpsReferences';  //JSON_Edit_Link, ValidLocalLanguages

export function buildMiscPropsGroup( wpProps: IFpsPhotoFormWebPartProps, thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  const UseDefaultFormTabs = wpProps.enableExperimental === true ? DefaultFormTabsAll : DefaultFormTabsProduction;

  groupFields.push(
    // propsEasyMode

    ...[
      PropertyPaneToggle('enableExperimental', {
        label: 'Include experimental tabs',
        onText: 'Geo, Camera, Files etc',
        offText: 'Just Input, List, Map',
      }),

      PropertyPaneDropdown('defaultTab', {
        label: 'Default Tab',
        options: UseDefaultFormTabs.map( tab => { return { key: tab, text: tab }}),
      }),

      PropertyPaneDropdown('prefabForm', {
        label: 'Template form',
        options: PrefabFormTemplates.map( tab => { return { key: tab, text: tab }}),
      }),

      PropertyPaneToggle('forceFormTemplate', {
        label: 'Template as...',
        onText: 'Fixed settings',
        offText: 'Pre-filled',
      }),

      ...[ 1,2,3 ].map( i => {
        return PropertyPaneTextField(`category${i}s`, {
          label: `Categoryy${i} Labels ; separated`,
          description: '',
          multiline: true,
        })
      }),

      PropertyPaneTextField('photoButtonStyles', {
        label: 'Photo Button Styles',
        description: '',
        multiline: true,
      }),

      JSON_Edit_Link,

    ]
  );

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Misc Photo Form`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
