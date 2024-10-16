/**
 * CodeAnalizerComment: Updated 6 imports on 2024-09-22 17:16:57
 * Update:: import { IHelpTable } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps;'
 * Update:: import { ITrickRow } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow;'
 * Update:: import { APITricks } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow;'
 * Update:: import { BubbleTricks } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow;'
 * Update:: import { CommonTricks } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow;'
 * Update:: import { SuggestionTricks } to '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow;'

 */


import { IHelpTable, } from '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ISinglePageProps';
import { ITrickRow, APITricks, BubbleTricks, CommonTricks, SuggestionTricks, } from '@mikezimm/fps-core-v7/lib/banner/components/SingleHelpPage/interfaces/ITrickRow';
import { createTricksTable, } from "@mikezimm/fps-library-v2/lib/banner/components/SingleHelpPage/makeTricksTable";

export function advancedContent( ): { table: IHelpTable } {

  const QAAPI: ITrickRow = { param: `useQAOutsystemsAPI`, value: `true` , description: `useQAOutsystemsAPI - Use QA Outsystems api endpoint` };
  const ShowUpdateSource: ITrickRow = { param: `showUpdateSource`, value: `true` , description: `showUpdateSource - Summarize State fetch` };

  const table : IHelpTable  = createTricksTable(
    [
      ShowUpdateSource,
      SuggestionTricks,
      BubbleTricks,
      QAAPI,
      APITricks,
      ...CommonTricks,
    ]
  );

  return { table: table };

}


