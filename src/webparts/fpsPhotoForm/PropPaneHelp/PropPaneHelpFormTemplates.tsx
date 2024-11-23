import * as React from 'react';
// import { Icon } from '@fluentui/react/lib/Icon';
import { PivotItem, } from '@fluentui/react/lib/Pivot';

import { PrefabFormTemplates } from '../components/IFpsPhotoFormProps';

export function getWebPartHelpFormTemplates (  ): JSX.Element {

  const WebPartHelpElement = <PivotItem headerText={ 'Templates' } >
    <div className={ 'fps-pph-content' }>
        {/* https://github.com/fps-solutions/FPS-Photo-Form/issues/99 */}
        <div className={ 'fps-pph-topic' }>Potential Photo Form Templates</div>
        <div> { PrefabFormTemplates.map ( item=> { return item }).join(', ')}</div>
      </div>
    </PivotItem>;

  return WebPartHelpElement;

}