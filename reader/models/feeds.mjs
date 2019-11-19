import { Feed } from "./feed.mjs";

class Feeds {
  constructor(feeds) {
    this.feeds = feeds;
  }
}

import testfeeds from "~/../test/testfeeds.json";
function loadTestFeeds() {
  return new Feeds(testfeeds.map(f => new Feed(f.title, f.url)));
}

export { Feeds, loadTestFeeds };
