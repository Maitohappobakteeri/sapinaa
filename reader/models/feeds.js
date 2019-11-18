import { Feed } from "./feed.js";

var fs = require('fs');

class Feeds {
  constructor(feeds) {
    this.feeds = feeds;
  }
}

function loadTestFeeds(filename) {
  return new Feeds(JSON.parse(fs.readFileSync(filename, 'utf8'))
    .map(f => new Feed(f.title, f.url)));
}

export { Feeds, loadTestFeeds };
