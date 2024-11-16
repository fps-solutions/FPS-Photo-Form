import * as React from 'react';

interface MultiSelectDropdownProps {
  multiple?: boolean;
  options: { key: string; text: string }[];
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  multiple = false,
  options,
  selectedKeys,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange(selectedValues);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '200px' }}>
      <label style={{ marginBottom: '4px', fontWeight: 'bold' }}>Select Options:</label>
      <select
        multiple={ multiple }
        value={selectedKeys}
        onChange={handleChange}
        style={{
          height: '100px',
          overflowY: 'auto',
        }}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key} style={{ padding: '4px' }}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MultiSelectDropdown;
