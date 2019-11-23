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
      for (let i in this.feeds) {
        let f = this.feeds[i];
        f.refresh();
        await sleep(500);
      }
    }).bind(this));
  }

  newFeed() {
    let feed = new Feed(this.getNextUID(), this.newUrl);
    this.addFeed(feed);
    this.saveFeeds();
  }

  addFeed(feed) {
    if (feed.uid === undefined) {
      feed.uid = this.getNextUID();
    }

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
    let compactFeeds =  this.feeds
      .map(f => f.feed)
      .map(f => {return { uid: f.uid, title: f.customTitle, url: f.url };});
    Storage.save("feeds.json", {nextUID: this.nextUID, feeds: compactFeeds});
  }
}
