import { Feed } from "./feed.mjs";
import { createSourceArray } from "./derived-array.js";

class Feeds {
  constructor(feeds) {
    this.feeds = feeds;
  }
}

import testfeeds from "~/../test/testfeeds.json";
function loadTestFeeds() {
  return new Feeds(
    createSourceArray(testfeeds.map(f => new Feed(f.title, f.url)))
  );
}

export { Feeds, loadTestFeeds };
