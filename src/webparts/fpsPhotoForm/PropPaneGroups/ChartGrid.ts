/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneTextField,
  PropertyPaneToggle,
  IPropertyPaneField,
} from '@microsoft/sp-property-pane';

import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/33
export function buildChartDisplayGroup( thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  groupFields.push(
    // propsEasyMode
    ...[
      PropertyPaneTextField('chart_G_diameter', {
        label: 'Diamter / Width in Units',
        description: '',
      }),

      PropertyPaneTextField('chart_G_gridStep', {
        label: 'Default Grid Scale',
        description: 'Pick one:  10, 100, 250, 500, 1000, 2000',
      }),

      PropertyPaneToggle('chart_G_reverseVerticalAxis', {
        label: 'Reverse Vertical Axis',
        onText: 'Up is Negative -',
        offText: 'Up is Positive +',
      }),

      PropertyPaneTextField('chart_G_displaySize', {
        label: 'SVG Display Size factor',
        description: '',
        disabled: true,
      }),

      PropertyPaneTextField('chart_G_gridlineColor', {
        label: 'Gridline Color (name or code)',
        description: '',
      }),

      PropertyPaneTextField('chart_G_gridlineType', {
        label: 'Gridline Type:  Dashed, Dotted, Solid',
        description: '',
      }),

    ]


  );

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Chart Grid`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
