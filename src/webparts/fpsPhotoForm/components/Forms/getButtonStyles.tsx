const PlaceholderButtons = [
  {
    label: 'Other',
    styles: { }
  },
  {
    label: 'TBD',
    styles: { }
  },
  {
    label: 'NA',
    styles: { }
  }
]

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
    label: 'Cherry',
    styles: { background: '#33202B', color: '#DDBFB5' }
  },
  {
    label: 'Island',
    styles: { background: 'green', color: '#FFFE94' }
  },
  {
    label: 'Extreme Towers',
    styles: { background: '#d9d8d8', color: 'rgb(1 61 5)' }
  },
  {
    label: 'Lush Cave',
    styles: { background: '#447200', color: '#E8BDFF' } // #ffa9ea
  },
  {
    label: 'Snow',
    styles: { background: 'white', color: 'black',  } // fontSize: 'larger', fontWeight: 700, height: '33px', paddingTop: '2px'
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
    styles: { background: '#110A02', color: '#851313' }
  },
  {
    label: 'Tiaga',
    styles: { background: '#2D1203', color: '#CEA94F' }
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
    label: 'Cavern', // Essentially a massive cave
    styles: { background: '#A0A0A0', color: 'black' }
  },
  {
    label: 'Swamp',
    styles: { background: '#d4d4aa', color: '#33331a' }
  },
  {
    label: 'Mangrove',
    styles: { background: '#1E220A', color: '#5BD15E' }
  },
  ...PlaceholderButtons,
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
    styles: { background: '#A3804D', color: '#29292E' }
  },
  {
    label: 'Wreck',
    styles: { background: 'darkblue', color: 'yellow' }
  },
  {
    label: 'Spawner',
    styles: { background: '#202020', color: '#e60000' }
  },
  {
    label: 'Nether Portal',
    styles: { background: 'black', color: 'mediumpurple' }
  },
  {
    label: 'Buzz Base',
    styles: { background: 'green', color: 'yellow' }
  },
  {
    label: 'Cat Base',
    styles: { background: 'black', color: 'pink' }
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
    label: 'Trials',
    styles: { background: '#b85233', color: '#33b873' }
  },
  {
    label: 'End Portal',
    styles: { background: '#004b49', color: 'khaki' }
  },
  {
    label: 'End City',
    styles: { background: 'black', color: 'khaki' }
  },
  {
    label: 'Fortress',
    styles: { background: '#660000', color: '#ffff00' }
  },
  {
    label: 'Witch',
    styles: { background: '#1E220A', color: 'khaki' }
  },
  {
    label: 'Ruin',
    styles: { background: '#004b49', color: 'khaki' }
  },
  ...PlaceholderButtons,
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
