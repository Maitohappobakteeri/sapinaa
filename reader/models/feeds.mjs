import { Feed } from "./feed.mjs";
import { createSourceArray } from "./derived-array.js";

export class Feeds {
  constructor(feeds) {
    this.feeds = feeds || [];
  }
}

import testfeeds from "~/../test/testfeeds.json";
export function loadTestFeeds() {
  return new Feeds(
    createSourceArray(testfeeds.map(f => new Feed(f.title, f.url)))
  );
}
