import { FeedUI } from "./feed-ui.mjs";

export class FeedListUI {
  constructor(feeds) {
    this.feeds = feeds.feeds.map(f => new FeedUI(f));
  }

  addFeed(feed) {
    this.feeds.push(new FeedUI(feed));
  }

  activateFeed(feed) {
    console.log("Activating feed", feed.title);
    this.feeds.filter(f => f !== feed).forEach(f => f.deactivate());
    feed.activate();
  }

  get defaultFeed() {
    return this.feeds[0];
  }
}
