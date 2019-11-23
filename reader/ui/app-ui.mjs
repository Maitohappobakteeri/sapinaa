import { TransitionEmitter } from "./transitions.mjs";
import { ActionEmitter } from "./actions.mjs";
import { Storage } from "../storage.mjs";
import { Feed } from "../models/feed.mjs";

export class AppUI {
  constructor(feedList) {
    this.current = undefined;
    this.feeds = feedList;
  }

  addFeed(feed) {
    this.feeds.addFeed(feed);

    if (!this.current) {
      this.activateFeed(this.feeds.defaultFeed);
    }
  }

  async activateFeed(feed) {
    this.current = feed;
    await this.feeds.activateFeed(feed);
  }

  registerEvents() {
    TransitionEmitter.on("transition", (target, options) => {
      if (target ==  "feed") {
        this.activateFeed(options.feed);
      }
    });

    ActionEmitter.on("action", (target, options) => {
      if (target ==  "save") {
        this.feeds.saveFeeds();
      }
    });

    ActionEmitter.on("action", (target, options) => {
      if (target ==  "delete") {
        this.feeds.deleteFeed(options.feed);
        this.activateFeed(this.feeds.defaultFeed);
      }
    });
  }

  async loadConfig() {
    let conf = await Storage.load("feeds.json");
    this.feeds.nextUID = conf.nextUID || 0;
    conf.feeds.forEach(f => {
      let lastFetched = f.lastFetched && new Date(f.lastFetched) || null;
      this.addFeed(new Feed(f.uid, lastFetched, f.url, f.title));
    });
  }
}
