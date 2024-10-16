import * as React from 'react';
// import { Icon } from '@fluentui/react/lib/Icon';
import { PivotItem, } from '@fluentui/react/lib/Pivot';

export function getWebPartHelpElementBoxTiles (  ): JSX.Element {

  const WebPartHelpElement = <PivotItem headerText={ 'CoreFPS1173' } >
    <div className={ 'fps-pph-content' }>
        <div className={ 'fps-pph-topic' }>Box Tiles</div>
      </div>
    </PivotItem>;

  return WebPartHelpElement;

}