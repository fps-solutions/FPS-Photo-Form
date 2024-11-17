/**
 * CodeAnalizerComment: Updated 2 imports on 2024-09-22 17:16:57
 * Update:: import { IHelpTable } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps;'
 * Update:: import { IWebpartBannerProps } to '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps;'

 */

import { IHelpTable, } from '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps';// import { convertIssuesMarkdownStringToSpan } from '../../fpsReferences';

import { createAboutRow } from '@mikezimm/fps-library-v2/lib/banner/components/Panel/createAboutRow';
import { IWebpartBannerProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/IWebpartBannerProps';

export const panelVersionNumber = '2024-11-XX - 0.0.14 PF'; //Added to show in panel

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

    // table.rows.push( createAboutRow('2024-11-XX',"0.0.15",`#`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    // table.rows.push( createAboutRow('2024-11-XX',"0.0.13",`#`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-11-XX',"0.0.14",`#88, #89, #90, #91, #93, #94, #95, #96, #98 - FileDrop`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-11-14',"0.0.12",`#85`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );

    table.rows.push( createAboutRow('2024-11-08',"0.0.11",`#80, #81, #82, #83`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-11-06',"0.0.10",`#19, #73, #75, #78`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );

    table.rows.push( createAboutRow('2024-11-04',"0.0.9",`#68, #69, #70, #72`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-11-01',"0.0.8",`#64, #65, #66`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-31',"0.0.7",`#60, #61, #62 Halloween Update! 🎃`, bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('V',         "V",    "#27, #51, #53, #54, #56, #57, ", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-30',"0.0.6","#43, #44, #45, #46, #47, #48, #49", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-29',"0.0.5","#40 - No List Title Throttle hotfix", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-29',"0.0.4","#31, #32, #33, #34, #35, #36, #37, #38, #39", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('V',         "V",    "#14, #17, #20, #22, #24, #25, #26, #28, #29, ", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-20',"0.0.3","#3, #5, #6, #7, #8, #9, #10, #11, #12", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    table.rows.push( createAboutRow('2024-10-18',"0.0.2","#1, #2", bannerProps.showRepoLinks === true ? bannerProps.gitHubRepo : null ) );
    return { table: table };

}

