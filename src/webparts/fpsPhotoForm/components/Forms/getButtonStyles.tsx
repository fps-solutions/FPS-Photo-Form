export const ButtonStylesMinecraftBiomes = [
  {
    label: 'Desert',
    styles: { background: 'yellow', color: 'black' }
  },
  {
    label: 'Jungle',
    styles: { background: 'green', color: 'lime' }
  },
  {
    label: 'Bamboo',
    styles: { background: 'green', color: 'yellow' }
  },
  {
    label: 'Mountain',
    styles: { background: 'gray', color: 'white' }
  },
  {
    label: 'Island',
    styles: { background: 'green', color: 'white' }
  },
  {
    label: 'Lush',
    styles: { background: 'green', color: 'lightorange' }
  },
  {
    label: 'Snow',
    styles: { background: 'white', color: 'black', fontSize: 'larger', fontWeight: 700 }
  },
  {
    label: 'Ocean',
    styles: { background: 'lightblue', color: 'darkblue' }
  },
  {
    label: 'Warm Ocean',
    styles: { background: 'Aquamarine', color: 'magenta' }
  },
  {
    label: 'Dark Oak',
    styles: { background: '#321414', color: 'lightgreen' }
  },
  {
    label: 'Tiaga',
    styles: { background: '#321414', color: 'lightgreen' }
  },
  {
    label: 'Mineshaft',
    styles: { background: '#F7DC6F', color: '#6e2c00' }
  },
  {
    label: 'Base',
    styles: { background: 'black', color: 'pink' }
  },
  {
    label: 'Wreck',
    styles: { background: 'darkblue', color: 'yellow' }
  },
  {
    label: 'Dripstone',
    styles: { background: '#ffcc99', color: '#cc0000' }
  },
  {
    label: 'Cave',
    styles: { background: '#A0A0A0', color: 'black' }
  },
  {
    label: 'Swamp',
    styles: { background: '#d4d4aa', color: '#33331a' }
  },
  {
    label: 'Mangrove',
    styles: { background: '#d4d4aa', color: '#602020' }
  },
];
export const ButtonStylesMinecraftDimensions = [
  {
    label: 'Overworld',
    styles: { background: 'green', color: 'white' }
  },
  {
    label: 'Nether',
    styles: { background: 'orange', color: 'black' }
  },
  {
    label: 'End',
    styles: { background: 'gray', color: 'yellow' }
  },
];
export const ButtonStylesMinecraftStructures = [
  {
    label: 'Village',
    styles: { background: '', color: '' }
  },
  {
    label: 'Mineshaft',
    styles: { background: 'darkgray', color: 'lightbrown' }
  },
  {
    label: 'Wreck',
    styles: { background: '', color: '' }
  },
  {
    label: 'Nether Portal',
    styles: { background: 'black', color: 'mediumpurple' }
  },
  {
    label: 'Trials',
    styles: { background: '#b85233', color: '#33b873' }
  },
  {
    label: 'End Portal',
    styles: { background: '#004b49', color: 'khaki' }
  },
  {
    label: 'Buzz Base',
    styles: { background: '', color: '' }
  },
  {
    label: 'Cat Base',
    styles: { background: 'black', color: 'pink' }
  },
  {
    label: 'Wreck',
    styles: { background: 'darkblue', color: 'yellow' }
  },
  {
    label: 'Geode',
    styles: { background: '#9A5CC6', color: 'yellow' }
  },
  {
    label: 'Ancient City',
    styles: { background: 'black', color: 'khaki' }
  },
  {
    label: 'End City',
    styles: { background: 'black', color: 'khaki' }
  },
  {
    label: 'Spawner',
    styles: { background: '#202020', color: '#e60000' }
  },
  {
    label: 'Fortress',
    styles: { background: '#660000', color: '#ffff00' }
  },
];
const ButtonStyles = [
  ...ButtonStylesMinecraftDimensions, ...ButtonStylesMinecraftBiomes, ...ButtonStylesMinecraftStructures
];

export function getButtonStyles(label: string): any {
  let results = {};
  ButtonStyles.map(but => {
    if (but.label === label) results = but.styles;
  });
  return results;
}
