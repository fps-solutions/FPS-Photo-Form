/**
 * CodeAnalizerComment: Updated 2 imports on 2024-09-22 17:16:57
 * Update:: import { IHelpTable } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps;'
 * Update:: import { IWebpartBannerProps } to '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps;'

 */

import { IHelpTable, } from '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps';// import { convertIssuesMarkdownStringToSpan } from '../../fpsReferences';

import { createAboutRow } from '@mikezimm/fps-library-v2/lib/banner/components/Panel/createAboutRow';
import { IWebpartBannerProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps';

export const panelVersionNumber = '2024-10-20 - 0.0.3 PF'; //Added to show in panel

export function aboutTable( bannerProps: IWebpartBannerProps ): { table: IHelpTable } {

    const table : IHelpTable  = {
      heading: 'Version History',
      headers: ['Date','Version','Focus'],
      rows: [],
    };

    /**
     * Security update log
     *
     * converting all links and cdns to lower case so casing does miss a flag
     * standardizing all cdn links to start with /sites/ if on tenant
     * standardinzing all tag lings to start with /sites/ if on tenant
     * removing any extra // from both cdns and file links so you cant add extra slash in a url and slip by
     *
     * Does NOT find files without extensions (like images and also script files.)
     *
     * WARNING:  DO NOT add any CDNs to Global Warn or Approve unless you want it to apply to JS as well.
     */

    table.rows.push( createAboutRow('2024-10-20',"0.0.3","#3, #5, #6, #7, #8, #10", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-18',"0.0.2","#1, #2", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    return { table: table };

}

