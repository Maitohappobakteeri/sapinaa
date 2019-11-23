import { Feed } from "../models/feed.mjs";
import { FeedUI } from "./feed-ui.mjs";
import { Config } from "../config.mjs";

export class FeedListUI {
  constructor(feeds) {
    this.newUrl = "";
    this.feeds = feeds.feeds.map(f => new FeedUI(f));
  }

  newFeed() {
    let feed = new Feed(this.newUrl);
    this.addFeed(feed);
    this.saveFeeds();
  }

  addFeed(feed) {
    this.feeds.push(new FeedUI(feed));
  }

  deleteFeed(feed) {
    this.feeds = this.feeds.filter(f => f !== feed);
    this.saveFeeds();
  }

  activateFeed(feed) {
    console.log("Activating feed", feed.title);
    this.feeds.filter(f => f !== feed).forEach(f => f.deactivate());
    feed.activate();
  }

  get defaultFeed() {
    return this.feeds[0];
  }

  saveFeeds() {
    Config.save("feeds.json", this.feeds
      .map(f => f.feed)
      .map(f => {
        return { title: f.customTitle, url: f.url };
      }));
  }
}
