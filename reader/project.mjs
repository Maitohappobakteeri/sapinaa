export const name = "Säpinää";
export const version = "0.0.0";
export const isDebug =
  typeof process !== 'undefined'
  && process.env.SAPINAA_DEBUG;
export const useCacheOnly =
  typeof process !== 'undefined'
  && process.env.SAPINAA_CACHE_ONLY;
