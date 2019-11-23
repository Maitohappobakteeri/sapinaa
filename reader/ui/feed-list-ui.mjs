import { Feed } from "../models/feed.mjs";
import { FeedUI } from "./feed-ui.mjs";
import { Storage } from "../storage.mjs";
import { sleep } from "../utility/async.mjs";

export class FeedListUI {
  constructor(feeds) {
    this.newUrl = "";
    this.feeds = feeds.feeds.map(f => new FeedUI(f));
    this.nextUID = undefined;
  }

  getNextUID() {
    let uid = this.nextUID;
    this.nextUID += 1;
    return uid;
  }

  refresh() {
    setImmediate((async function() {
      for (let f of this.feeds) {
        f.refresh();
        await sleep(500);
      }
    }).bind(this));
    this.saveFeeds();
  }

  newFeed() {
    let feed = new Feed(this.getNextUID(), null, this.newUrl);
    this.addFeed(feed);
    this.saveFeeds();
  }

  addFeed(feed) {
    if (feed.uid === undefined) {
      feed.uid = this.getNextUID();
    }

    feed.load();
    this.feeds.push(new FeedUI(feed));
  }

  deleteFeed(feed) {
    this.feeds = this.feeds.filter(f => f !== feed);
    this.saveFeeds();
  }

  async activateFeed(feed) {
    console.log("Activating feed", feed.title);
    this.feeds.filter(f => f !== feed).forEach(f => f.deactivate());
    await feed.activate();
    this.saveFeeds();
  }

  get defaultFeed() {
    return this.feeds[0];
  }

  saveFeeds() {
    // TODO: Separate config and cached data
    let compactFeeds =  this.feeds
      .map(f => f.feed)
      .map(f => {return {
        uid: f.uid, title: f.customTitle, url: f.url, lastFetched: f.lastFetched
      };});
    Storage.save("feeds.json", {nextUID: this.nextUID, feeds: compactFeeds});
  }
}
