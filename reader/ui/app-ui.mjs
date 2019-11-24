import { TransitionEmitter } from "./transitions.mjs";
import { ActionEmitter } from "./actions.mjs";
import { Storage } from "../storage.mjs";
import { Feed } from "../models/feed.mjs";
import { loop } from "../utility/async.mjs";

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

  startTimers() {
    loop((() => this.feeds.lazyRefresh()).bind(this), 15 * 60 * 1000);
  }

  async start() {
    this.registerEvents();
    await this.loadConfig();
    this.startTimers();
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
      this.addFeed(new Feed({
        uid: f.uid,
        url: f.url,
        customTitle: f.title
      }));
    });
  }
}
