// import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import MultiSelectDropdown from './fps-Dropdown'; // Adjust import path
// import { IMultiSelectDropdownProps } from './IMultiSelectDropdownProps';

// export function PropertyPaneMultiSelectDropdown(
//   props: IMultiSelectDropdownProps
// ): IPropertyPaneField<IPropertyPaneCustomFieldProps> {
//   return {
//     type: 1, // Custom field type
//     targetProperty: props.key,
//     properties: {
//       key: props.key,
//       onRender: (elem: HTMLElement) => {
//         if (!elem) {
//           console.error('Error: Element for rendering is null or undefined');
//           return;
//         }

//         // Render the React component inside the DOM element
//         ReactDOM.render(
//           <MultiSelectDropdown
//             key={props.key}
//             label={props.label}
//             description={props.description}
//             maxVsibleRows={props.maxVsibleRows}
//             options={props.options}
//             multiple={ props.multiple }
//             selectedKeys={props.selectedKeys}
//             onChange={(selectedKeys: string[]) => {
//               props.onChange(selectedKeys);
//             }}
//             styles={ { maxWidth: '250px' } }
//           />,
//           elem
//         );
//       },
//       onDispose: (elem: HTMLElement) => {
//         // Unmount the React component on dispose
//         ReactDOM.unmountComponentAtNode(elem);
//       },
//     },
//   };
// }
