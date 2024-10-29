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
      PropertyPaneTextField('chart_diameter', {
        label: 'Diamter / Width in Units',
        description: '',
      }),
      PropertyPaneTextField('chart_favorites', {
        label: 'Favorites - See Click Yellow Icon',
        description: '1;3;6 OR 1 | Label | Color | Icon; 2 | NewLabel...',
      }),
      PropertyPaneTextField('chart_gridStep', {
        label: 'Default Grid Scale',
        description: 'Pick one:  10, 100, 250, 500, 1000, 2000',
      }),
      PropertyPaneToggle('chart_reverseVerticalAxis', {
        label: 'Reverse Vertical Axis',
        onText: 'Up is Negative -',
        offText: 'Up is Positive +',
      }),
      PropertyPaneTextField('chart_gridlineColor', {
        label: 'Gridline Color (name or code)',
        description: '',
      }),
      PropertyPaneTextField('chart_gridlineType', {
        label: 'Gridline Type:  Dashed, Dotted, Solid',
        description: '',
      }),
      // PropertyPaneTextField('chart_displaySize', {
      //   label: '',
      //   description: '',
      // }),
      PropertyPaneTextField('chart_divStyle', {
        label: 'Chart css - React.CSSProperties',
        description: `{ background: 'limegreen', padding: '3em' }`,
      }),

    ]


  );

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Chart Display settings`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
