import * as PKGJSON from "../package.json";

export const name = "Säpinää";
export const version = PKGJSON.version;
export const isDebug =
  typeof process !== "undefined" && process.env.SAPINAA_DEBUG;
export const useCacheOnly =
  typeof process !== "undefined" && process.env.SAPINAA_CACHE_ONLY;
