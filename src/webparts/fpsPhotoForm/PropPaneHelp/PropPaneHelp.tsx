import * as React from 'react';
// import { Icon } from '@fluentui/react/lib/Icon';
import { PivotItem, } from '@fluentui/react/lib/Pivot';

export function getWebPartHelpElementBoxTiles (  ): JSX.Element {

  const WebPartHelpElement = <PivotItem headerText={ 'Photo Form' } >
    <div className={ 'fps-pph-content' }>
        <div className={ 'fps-pph-topic' }>Photo Form</div>
      </div>
    </PivotItem>;

  return WebPartHelpElement;

}