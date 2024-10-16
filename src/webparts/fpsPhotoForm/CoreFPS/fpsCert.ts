/**
 * CodeAnalizerComment: Updated 4 imports on 2024-09-22 17:16:57
 * Update:: import { IFPSWPCert } to '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IFPSCert;'
 * Update:: import { TrickyTenantA } to '@mikezimm/fps-core-v7/lib/banner/features/Tricky/constants;'
 * Update:: import { TrickyTenantC2 } to '@mikezimm/fps-core-v7/lib/banner/features/Tricky/constants;'
 * Update:: import { TrickyTenantFPT } to '@mikezimm/fps-core-v7/lib/banner/features/Tricky/constants;'

 */

import { IFPSWPCert } from "@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IFPSCert";
import { TrickyTenantA, TrickyTenantC2, TrickyTenantFPT } from "@mikezimm/fps-core-v7/lib/banner/features/Tricky/constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Date1WeeksAgo = getDateFromNow( -7 );

export const FPSCert : IFPSWPCert[] = [
  {
    tenant: TrickyTenantC2,
    warnD: 555,
    // preset: [{
    //   source: 'WPPresetEverywhere',
    //   location: '*',
    //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
    //   props: {}, // { ...TenantCLinkUpPresetsCommon, ...TenantCLinkUpPresets },
    // }],
    // forced: [{
    //     source: 'ForceInterviewsSite',
    //     location: '/sites/Interviews/'.toLowerCase(),
    //     // eslint-disable-next-line @typescript-eslint/no-use-before-define
    //     props: {}, //  { ...TenantCLinkUpForced },
    //   },
    //   {
    //     source: 'ForceCompanyResearchSite',
    //     location: '/sites/CompanyResearch/'.toLowerCase(),
    //     // eslint-disable-next-line @typescript-eslint/no-use-before-define
    //     props: {}, //  { ...TenantCLinkUpForced },
    // }],
  },
  {
    tenant: TrickyTenantFPT,
    warnD: 555,
    // preset: [{
    //   source: 'WPPresetEverywhere',
    //   location: '*',
    //   props: {},
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // props: { ...TenantCLinkUpPresetsCommon, ...TenantCLinkUpPresets },
    // }],
    // forced: [{
    //   source: 'ForceInterviewsSite',
    //   location: '/sites/Interviews/'.toLowerCase(),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // props: { ...TenantCLinkUpForced },
    // },{
    //   source: 'ForceCompanyResearchSite',
    //   location: '/sites/CompanyResearch/'.toLowerCase(),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // props: { ...TenantCLinkUpForced },
    // }],
  },{
    tenant: TrickyTenantA,
    expiration: new Date( 2023, 11   -1 ,   30 ),
    notify: `xyz@alv.com`,
    warnD: 1,
  },
  {
    tenant: '*',
    // preset: [{
    //   source: 'WPPresetEverywhere',
    //   location: '*',
    //   props: {
    //     bannerStyleChoice: 'redDark',
    //   }
    // }],
  },

];