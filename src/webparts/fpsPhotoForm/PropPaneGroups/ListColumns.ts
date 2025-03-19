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

export function buildListColumnsGroup( thisWPClass: IThisFPSWebPartClass ): IPropertyPaneGroup {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupFields: IPropertyPaneField<any>[] = [];

  groupFields.push(
    // propsEasyMode
    ...[
      PropertyPaneTextField('axis_Title', {
        label: 'Title Column - ALL Internal Names',
        description: '',
      }),
      PropertyPaneTextField('axis_Comments', {
        label: 'Comments',
        description: '',
      }),

      PropertyPaneTextField('axis_horz', {
        label: 'Horizontal Axis (numb)',
        description: '',
      }),
      PropertyPaneTextField('axis_vert', {
        label: 'Vertical Axis (numb)',
        description: '',
      }),
      PropertyPaneTextField('axis_depth', {
        label: 'Depth Axis (numb)',
        description: '',
      }),

      PropertyPaneTextField('axis_Screenshot', {
        label: 'Screenshot Link - TEXT column',
        description: '',
      }),

      PropertyPaneTextField('axis_Category1', {
        label: 'Category1 - Primary SINGLE Select',
        description: '',
      }),
      PropertyPaneTextField('axis_Category2', {
        label: 'Category2 - MULTI Select',
        description: '',
      }),
      PropertyPaneTextField('axis_Category3', {
        label: 'Category3 - MULTI Select',
        description: '',
      }),

      PropertyPaneTextField('axis_Color', {
        label: 'HTML Color column',
        description: '',
      }),

      PropertyPaneTextField('axis_createItemHandleBars', {
        label: 'List Item Save Handlebars',
        description: 'See prop pane help (Yellow button)',
      }),
      // PropertyPaneTextField('axis_Shape', {
      //   label: '',
      //   description: '',
      // }),
    ]


  );

  groupFields.push();

  const ExportThisGroup: IPropertyPaneGroup = {
    groupName: `List Column Mapping`,
    isCollapsed: true,
    groupFields: groupFields
  };

  return ExportThisGroup;

}
