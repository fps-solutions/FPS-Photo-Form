import * as React from 'react';
// import { Icon } from '@fluentui/react/lib/Icon';
import { PivotItem, } from '@fluentui/react/lib/Pivot';
import { FPSReactJSON } from '@mikezimm/fps-library-v2/lib/components/atoms/ReactJSON/ReactJSONObjectV2';
import { ButtonStylesMC, ButtonStylesMinecraftBiomes, ButtonStylesMinecraftDimensions, ButtonStylesMinecraftStructures } from '../components/Forms/getButtonStyles';

// category1s: ButtonStylesMinecraftDimensions.map( x => x.label).join(', '),
// category2s: ButtonStylesMinecraftBiomes.map( x => x.label).join(', '),
// category3s: ButtonStylesMinecraftStructures.map( x => x.label).join(', '),

// https://github.com/fps-solutions/FPS-Photo-Form/issues/18
export function getWebPartHelpButtonStyles (  ): JSX.Element {

  const WebPartHelpElement = <PivotItem headerText={ 'Button Styles' } >
    <div className={ 'fps-pph-content' } style={{ display: 'flex' }}>
      <div>
        <div className={ 'fps-pph-topic' }>MC Styles</div>
        <FPSReactJSON name='Minecraft Styles' jsonObject={ ButtonStylesMC } />
      </div>
      <div>
        <div className={ 'fps-pph-topic' }>MC Category1s</div>
        <div>{ ButtonStylesMinecraftDimensions.map( x => x.label).join(', ') }</div>

        <div className={ 'fps-pph-topic' }>MC Category2s</div>
        <div>{ ButtonStylesMinecraftBiomes.map( x => x.label).join(', ') }</div>

        <div className={ 'fps-pph-topic' }>MC Category3s</div>
        <div>{ ButtonStylesMinecraftStructures.map( x => x.label).join(', ') }</div>
      </div>
      </div>
    </PivotItem>;

  return WebPartHelpElement;

}