import { IPropertyPaneField, IPropertyPaneCustomFieldProps } from '@microsoft/sp-property-pane';

/**
 * Suggested usage for this prop pane control:
 *
    PropertyPaneMultiSelectDropdown({
      key: 'selectedKeys',
      label: 'Choose Options',
      options: [
        { key: 'option1', text: 'Option 1' },
        { key: 'option2', text: 'Option 2' },
        { key: 'option3', text: 'Option 3' },
      ],
      selectedKeys: this.properties.selectedKeys || [],
      onChange: (newKeys: string[]) => {
        this.properties.selectedKeys = newKeys;
        this.render(); // Re-render web part to reflect changes
      },
    }),
 *
 */

export interface ICustomMultiSelectProps {
  key: string;
  label: string;
  options: { key: string; text: string }[];
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
}

export function PropertyPaneMultiSelectDropdown(
  properties: ICustomMultiSelectProps
): IPropertyPaneField<IPropertyPaneCustomFieldProps> {
  return {
    type: 1, // Custom field type
    targetProperty: properties.key,
    properties: {
      key: properties.key,
      onRender: (elem: HTMLElement) => {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = properties.label;
        label.style.fontWeight = 'bold';
        label.style.display = 'block';
        label.style.marginBottom = '5px';

        const select = document.createElement('select');
        select.multiple = true;
        select.style.width = '100%';
        select.style.height = '120px';
        select.style.border = '1px solid #ccc';
        select.style.borderRadius = '4px';
        select.style.padding = '5px';

        // Add options
        properties.options.forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option.key;
          opt.textContent = option.text;

          // Use indexOf instead of includes
          opt.selected = properties.selectedKeys.indexOf(option.key) !== -1;
          select.appendChild(opt);
        });

        select.addEventListener('change', () => {
          const selectedValues = Array.from(select.selectedOptions, (opt) => opt.value);
          properties.onChange(selectedValues);
        });

        container.appendChild(label);
        container.appendChild(select);
        elem.appendChild(container);
      },
      onDispose: (elem: HTMLElement) => {
        while (elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
      },
    },
  };
}
