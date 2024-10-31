/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IThisFPSWebPartClass } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152;'

 */

import {
  IPropertyPaneGroup,
  PropertyPaneTextField,
  PropertyPaneToggle,
  IPropertyPaneField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownProps,
} from '@microsoft/sp-property-pane';

import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';
import { QtyHistoryDefaultChoices, UserHistoryDefaultChoices } from '../components/Forms/IScatterChartProps';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/33
export function buildChartFeatureGroup( thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  groupFields.push(
    // propsEasyMode
    ...[

      PropertyPaneTextField('chart_F_favorites', {
        label: 'Favorites - See Click Yellow Icon',
        description: '1;3;6 OR 1 | Label | Color | Icon; 2 | NewLabel...',
      }),

      PropertyPaneTextField('chart_F_divStyle', {
        label: 'Chart css - React.CSSProperties',
        description: `{ background: 'limegreen', padding: '3em' }`,
      }),

      PropertyPaneToggle('chart_F_autoFadeDots', {
        label: 'Auto-Fade Dots',
        onText: 'On',
        offText: 'Off',
      }),

      PropertyPaneToggle('chart_F_autoFadeText', {
        label: 'Auto-Fade Text',
        onText: 'On',
        offText: 'Off',
      }),
      PropertyPaneToggle('chart_F_centerLatest', {
        label: 'Auto Center/Zoom on latest',
        onText: 'On',
        offText: 'Off',
      }),

      PropertyPaneDropdown('chart_F_userHistory', <IPropertyPaneDropdownProps>{
        label: `Default History - User Filter`,
        options: UserHistoryDefaultChoices,
      }),

      PropertyPaneDropdown('chart_F_qtyHistory', <IPropertyPaneDropdownProps>{
        label: `Default History - Qty`,
        options: QtyHistoryDefaultChoices,
      }),

      PropertyPaneTextField('chart_F_defHistoryCap', {
        label: 'Default History Cap Qty',
        description: ``,
      }),
    ]

  );

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `Chart Features`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
