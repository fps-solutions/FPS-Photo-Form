
import { whyContent } from './Whyme';  //2022-01-31: Added Pivot Tiles
import { aboutTable } from './About';
import { gettingStartedContent } from './GettingStarted';
import { errorsContent } from './Errors';
import { advancedContent } from './Advanced';
import { futureContent } from './FuturePlans';
import { basicsContent } from './Basics';
import { tricksTable } from './Tricks';
import { getRandomTip, webParTips } from './Tips';
import { IWebpartBannerProps, IBannerPages } from '../fpsReferences';

export function getBannerPages ( bannerProps: IWebpartBannerProps ): IBannerPages {

    const result : IBannerPages = {
        whyContent:  whyContent( ),
        aboutTable:  aboutTable( bannerProps ),
        gettingStartedContent:  gettingStartedContent( ),
        errorsContent:  errorsContent( ),
        advancedContent:  advancedContent( ),
        futureContent:  futureContent( ),
        basicsContent: basicsContent( ),
        tricksTable:  tricksTable( ),
        getRandomTip:  getRandomTip( ),
        webParTips:  webParTips,
    };

    return result;

}