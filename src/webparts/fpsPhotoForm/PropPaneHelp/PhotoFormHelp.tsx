/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 14:49:52
 * Update:: import { IWebpartBannerProps } to '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps;'

 */

/**
 * CodeAnalizerComment: Updated 2 imports on 2024-09-21 23:07:24
 * Update:: import { PivotLinkFormat } to '@mikezimm/fps-core-v7/lib/types/@fluentUI/@7.199.1/Pivot;'
 * Update:: import { PivotLinkSize } to '@mikezimm/fps-core-v7/lib/types/@fluentUI/@7.199.1/Pivot;'

 */

import * as React from 'react';

import { PivotLinkFormat, PivotLinkSize } from '@fluentui/react/lib/Pivot';
import { Pivot, PivotItem,} from '@fluentui/react/lib/Pivot'

import { getWebPartHelpButtonStyles } from './PropPaneHelpButtonStyles';
import { getWebPartHelpFormTemplates } from './PropPaneHelpFormTemplates';
import { IWebpartBannerProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps';
import { getWebPartHelpFilePicker } from './PropPaneHelpFilePicker';

export function getHelpPhotoForm ( bannerProps: IWebpartBannerProps ) : JSX.Element {
  //headerText={ 'Performance' }
  const pages: JSX.Element[] = [
    getWebPartHelpFormTemplates ( ) ,
    getWebPartHelpFilePicker ( ) ,
    getWebPartHelpButtonStyles (  ) ,
  ];

  const WebPartHelpElement = <PivotItem headerText={ 'Views' } >
    {/* https://github.com/mikezimm/drilldown7/issues/400 */}
    <div style={{ overflowX: 'scroll', marginTop: '1.5em'  }}>
      <Pivot
          linkFormat={PivotLinkFormat.tabs}
          linkSize={PivotLinkSize.normal}
        >
        { pages }
      </Pivot>
    </div>
  </PivotItem>;

  return WebPartHelpElement;

}