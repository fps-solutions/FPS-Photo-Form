// import * as React from 'react';

// import * as fpsAppIcons from '@mikezimm/npmfunctions/dist/Icons/standardExStorage';

// import { Icon  } from '@fluentui/react/lib/Icon';

// import { buildAppWarnIcon, buildClickableIcon } from '@mikezimm/npmfunctions/dist/Icons/stdIconsBuildersV02';

// import * as StdIcons from '@mikezimm/npmfunctions/dist/Icons/iconNames';

// import { IHelpTable, } from '../../fpsReferences';
// import { IRepoLinks, repoLink, } from '../../fpsReferences';
// import { convertIssuesMarkdownStringToSpan } from '../../fpsReferences';

// const iconStyles: any = { root: {
//   fontSize: 'x-large',
//   fontWeight: 600,
//   paddingRight: '10px',
//   paddingLeft: '10px',
// }};

// const gridIcon = <Icon iconName={"GridViewSmall"}  style={ iconStyles } />;
// const tilesIcon = <Icon iconName={"Tiles"}  style={ iconStyles } />;
// const filterIcon = <Icon iconName={"ClearFilter"}  style={ iconStyles } />;
// const dashIcon = <Icon iconName={"ChromeMinimize"}  style={ iconStyles } />;

// const tipCellStyle: React.CSSProperties = {paddingRight: '20px' };

export const webParTips : JSX.Element[] = [

//Sample of basic tip

//   <tr><td style={tipCellStyle}>CTRL-Click <b>Category</b></td>
//       <td style={tipCellStyle}>Top Left</td>
//       <td>Set that Category as the "Hero" Category</td></tr>,

//Sample of tip with an icon in it
//   <tr><td style={tipCellStyle}>Click on &nbsp; <b>Grid Icon { gridIcon } { tilesIcon } </b></td>
//       <td style={tipCellStyle}>Upper Right</td>
//       <td>Change format of tiles to Cards, List, Tiles</td></tr>,

];


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRandomTip( ): any {

  return webParTips[Math.floor(Math.random() * webParTips.length)];

}