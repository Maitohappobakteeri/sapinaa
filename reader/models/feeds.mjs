import { Feed } from "./feed.mjs";
import { createSourceArray } from "./derived-array.mjs";

// TODO: Delete this file
export class Feeds {
  constructor(feeds) {
    this.feeds = feeds || [];
  }
}

import testfeeds from "~/../test/testfeeds.json";
export function loadTestFeeds() {
  return new Feeds(
    createSourceArray(testfeeds.map(f => new Feed(f.url, f.title)))
  );
}
