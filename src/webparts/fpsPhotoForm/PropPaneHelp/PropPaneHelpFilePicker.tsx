import * as React from 'react';
// import { Icon } from '@fluentui/react/lib/Icon';
import { PivotItem, } from '@fluentui/react/lib/Pivot';
import { FPSReactJSON } from '@mikezimm/fps-library-v2/lib/components/atoms/ReactJSON/ReactJSONObjectV2';
import { Specific_MIME_Objects } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/FileDropBox/fps-FileDropTypes';

export const FileNameHandleBarsMC: string = `{{Today}}_{{Category1}}_{{Category2}}_{{Category3}}_{{Title}}_X{{Number1}}_Y{{Number2}}_Z{{Number3}}_{{Comments}}`;
export const FileNameHandleBarsSub1: string = `{{Today}}_{{Category1}}_{{Category2}}_{{Category3}}_{{Title}}_X{{Number1}}_Y{{Number2}}_Z{{Number3}}_{{Comments}}`;

export function getWebPartHelpFilePicker (  ): JSX.Element {

  const WebPartHelpElement = <PivotItem headerText={ 'File Picker' } >
    <div className={ 'fps-pph-content' }>
        <div className={ 'fps-pph-topic' }>File Name Handle Bars</div>
        <div>{ FileNameHandleBarsMC }</div>
        <div className={ 'fps-pph-topic' }>File Types</div>

        {/* https://github.com/fps-solutions/FPS-Photo-Form/issues/97 */}
        <FPSReactJSON jsonObject={ Specific_MIME_Objects } name='Specific File Types' />
      </div>
    </PivotItem>;

  return WebPartHelpElement;

}