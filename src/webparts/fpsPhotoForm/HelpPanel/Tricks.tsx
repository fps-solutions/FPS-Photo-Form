/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IHelpTable } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps;'

 */

import * as React from 'react';
import { IHelpTable, } from '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps';// import { convertIssuesMarkdownStringToSpan } from '../../fpsReferences';
import { makeid } from '../fpsReferences';
import { escape } from '@microsoft/sp-lodash-subset';
// import { IRepoLinks,  } from '../../fpsReferences';
// import { convertIssuesMarkdownStringToSpan } from '../../fpsReferences';

export function tricksTable( ) : { table: IHelpTable } {

    const table : IHelpTable  = {
        heading: 'Undocumented and dangerous url parameters',
        headers: ['Param','Value','Active?', 'Notes'],
        rows: [],
    };

    const hasSearch = window.location.search && window.location.search.length > 0 ? true : false;
    let searchParams = hasSearch === true ? window.location.search : '';

    searchParams = searchParams.split('%3a').join(':');
    const hasSearchParams = searchParams.length > 0 ? '&' : '?';

    const hasScenarioDev = searchParams.indexOf('scenario=dev') > -1 ?
        makeCenteredBoldSpan( 'true' ) :
        makeCenteredBoldSpan (<a href={ window.location + hasSearchParams + 'scenario=dev' }>Activate!</a> ) ;

    const hasToolTrue = searchParams.indexOf('tool=true') > -1 ?
        makeCenteredBoldSpan( 'true' ) :
        makeCenteredBoldSpan (<a href={ window.location + hasSearchParams + 'tool=true' }>Activate!</a> ) ;

    const hasAllowOther = searchParams.indexOf('allowOtherSites=true') > -1 ?
        makeCenteredBoldSpan('true') :
        makeCenteredBoldSpan (<a href={ window.location + hasSearchParams + 'allowOtherSites=true' }>Activate!</a> ) ;

    const hasCrazy = searchParams.indexOf('crazy=true') > -1 ?  // eslint-disable-line @typescript-eslint/no-unused-vars
        makeCenteredBoldSpan('true') : '' ;

    const hasCreate = searchParams.indexOf('create=true') > -1 ?  // eslint-disable-line @typescript-eslint/no-unused-vars
        makeCenteredBoldSpan('true') : '' ;

    //Just replacing : with encoded url based on testing.
    const gulpParam1 = 'debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js';
    const gulpParam2 = 'debug=true&noredir=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js';

    const bareLink = hasSearch ?
        makeCenteredBoldSpan (<a href={ window.location.pathname }>Activate!</a> ) :
        makeCenteredBoldSpan('true');

    const hasGulp = searchParams.indexOf( gulpParam1 ) > -1 || searchParams.indexOf( gulpParam2 ) > -1
        ? makeCenteredBoldSpan('true')
        : makeCenteredBoldSpan (<a href={ window.location + hasSearchParams + gulpParam1 }>Activate!</a> ) ;

    table.rows.push( [ makeCenteredSpan('scenario'), makeCenteredSpan('dev'), hasScenarioDev,    <span key={makeid(3)}>{escape( `Opens up additional options - 'Rails Off' meaning limited safety checks.`) } </span>] );
    table.rows.push( [ makeCenteredSpan('tool'), makeCenteredSpan('true'), hasToolTrue,    <span key={makeid(3)}>{escape( `Displays commandbar in some webparts if it's hidden.` )} </span>] );
    table.rows.push( [ makeCenteredSpan('gulp serve'), makeCenteredSpan('dev'), hasGulp,    <span key={makeid(3)}>Adds param to Url to use gulp serve code instead of published code</span>] );
    table.rows.push( [ makeCenteredSpan('allowOtherSites'), makeCenteredSpan('true'), hasAllowOther,   <span key={makeid(3)}>{escape( `Allows you to do some 'Rails Off' functions on other sites { '' }`) } </span>] );
    table.rows.push( [ makeCenteredSpan('clearParams'), makeCenteredSpan( `${hasSearch}` ), bareLink,   <span key={makeid(3)}>{escape( `Reload without any parameters (wwwthing after the ? in the url )`) } </span>] );

    return { table: table };

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeCenteredSpan( info: any ): any {
    return { info: info, style: { textAlign: 'center'} } ;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeCenteredBoldSpan( info: any ): any {
    return { info: info, style: { textAlign: 'center', fontWeight: 'bolder' } } ;
}