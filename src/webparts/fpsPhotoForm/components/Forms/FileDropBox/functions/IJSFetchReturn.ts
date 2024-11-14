
// import { IFPSBaseContentType } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFPSBaseContentType";
// import { IFpsErrorObject, IUnifiedPerformanceOps } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFpsErrorObject";
// import { IFPSResultStatus } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFPSResultStatus";
// import { IFPSSearchAPIResultsData } from "@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/interfaces/IFPSSearchAPIResultsData";

// export interface IJSFetchReturn extends IFpsErrorObject {
//   status: IFPSResultStatus;
//   ok: boolean;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   items: any[];
//   e: any;
//   rawSearchResults?: IFPSSearchAPIResultsData;
//   fetchAPI: string;
//   unifiedPerformanceOps: IUnifiedPerformanceOps;
//   fpsContentType: IFPSBaseContentType[];

//   itemUrl?: string; // typically:  ServerRelativeUrl Used initially for fetching/uploading a file to get it's location.

//   method: IJSFetchMethod;

//   // These match the meta columns on IStateSource and IFPSItemSearch
//   meta0?: string[]; // Used for quick filtering - aka buttons or Pivots - meta0 is used for things like Type
//   meta1?: string[]; // Optional meta keys that can be added to state source
//   meta2?: string[]; // Optional meta keys that can be added to state source
//   meta3?: string[]; // Optional meta keys that can be added to state source
//   meta4?: string[]; // Optional meta keys that can be added to state source
//   metaA?: string[]; // Optional meta keys that can be added to state source
//   metaB?: string[]; // Optional meta keys that can be added to state source
//   metaC?: string[]; // Optional meta keys that can be added to state source


//   // These specific keys were added for PagePal but can be reused as needed
//   metaD?: string[]; // Optional meta keys that can be added to state source - PagePal 'DocIds'
//   metaS?: string[]; // Optional meta keys that can be added to state source - PagePal 'Sites'
//   metaW?: string[]; // Optional meta keys that can be added to state source - PagePal 'Webs'
//   metaL?: string[]; // Optional meta keys that can be added to state source - AnyWebP 'Lists'
//   metaF?: string[]; // Optional meta keys that can be added to state source - PagePal 'Files'

// }

// export type IJSFetchMethod = 'GET' | 'POST' | 'DELETE';

// export function createEmptyFetchReturn(fetchAPI: string, method: IJSFetchMethod, makeError: string = ''): IJSFetchReturn {
//   const emptyObject: IJSFetchReturn = {
//     items: [],
//     // 2024-09-15:  Added 'as any' when migrating from fps-library-v2
//     ok: makeError ? false : null as any,
//     e: makeError ? makeError : null,
//     status: makeError ? 'Error' : 'Unknown',
//     fetchAPI: fetchAPI,
//     unifiedPerformanceOps: {},
//     fpsContentType: [],
//     method: method,
//   };
//   return emptyObject;
// }
