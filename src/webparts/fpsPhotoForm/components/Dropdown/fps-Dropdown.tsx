// import * as React from 'react';
// import { IMultiSelectDropdownProps } from './IMultiSelectDropdownProps';

// require('./fps-Dropdown.css');

// const MultiSelectDropdown: React.FC<IMultiSelectDropdownProps> = ({
//   key, label, description, maxVsibleRows = 5,
//   multiple = false,
//   options,
//   selectedKeys,
//   onChange,
//   styles = {}, labelStyles ={},
//   className = '',
// }) => {
//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
//     const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
//     onChange(selectedValues);
//   };

//   return (
//     <div className={ `fps-Dropdown ${className}` } style={{ ...{ display: 'flex', flexDirection: 'column', maxWidth: '200px' }, ...styles } }>
//       <label style={{...{marginBottom: '4px', fontWeight: 'bold'}, ...labelStyles }}>{ `${label} [ ${selectedKeys.length } of ${options.length }]` }</label>
//       <select
//         multiple={ multiple }
//         value={selectedKeys}
//         onChange={handleChange}
//         style={{
//           height: multiple === true ? `${ Math.min( options.length, maxVsibleRows ) * 2 }em` : '2em',
//           overflowY: 'auto',
//         }}
//       >
//         {options.map((option) => (
//           <option
//             key={option.key}
//             value={option.key}
//             style={{ ...{ padding: '4px' }, ...option.style ? option.style : option.heading ? { fontWeight: 'bold', paddingTop: '5px' } : {} }}
//             disabled={ option.disabled || option.heading ? true : false } // Disable the option if the `disabled` property is true
//           >
//             { option.icon ? option.icon : undefined }
//             {option.text}
//           </option>
//         ))}
//       </select>
//       { description ? <div style={{ fontSize: 'smaller' }}>{ description }</div> : undefined }
//     </div>
//   );
// };

// export default MultiSelectDropdown;
