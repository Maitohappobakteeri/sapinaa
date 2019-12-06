import { TransitionEmitter } from "./transitions";
import { ActionEmitter } from "./actions";
import { Storage } from "../storage";
import { Feed } from "../data/feed";
import { FeedListUI } from "./feed-list-ui";

import { interval } from "rxjs";
import { startWith } from "rxjs/operators";

export class AppUI {
  current: Feed;
  feeds: FeedListUI;

  constructor(feedList) {
    this.current = null;
    this.feeds = feedList;
  }

  async addFeed(feed) {
    await this.feeds.addFeed(feed);
  }

  async activateFeed(feed) {
    this.current = feed;
    await this.feeds.activateFeed(feed);
  }

  startTimers() {
    interval(15 * 60 * 1000)
      .pipe(startWith(0))
      .subscribe(
        (() => {
          this.feeds.lazyRefresh();
        }).bind(this)
      );
  }

  async start() {
    this.registerEvents();
    await this.loadConfig();
    this.startTimers();
    this.activateFeed(this.feeds.defaultFeed);
  }

  registerEvents() {
    TransitionEmitter.on("transition", (target, options) => {
      if (target == "feed") {
        this.activateFeed(options.feed);
      }
    });

    ActionEmitter.on("action", (target, options) => {
      if (target == "save") {
        this.feeds.saveFeeds();
      }
    });

    ActionEmitter.on("action", (target, options) => {
      if (target == "delete") {
        this.feeds.deleteFeed(options.feed);
        this.activateFeed(this.feeds.defaultFeed);
      }
    });
  }

  async loadConfig() {
    let conf = await Storage.load("feeds.json");
    this.feeds.nextUID = conf.nextUID || 0;

    for (let f of conf.feeds) {
      await this.addFeed(
        new Feed({
          uid: f.uid,
          url: f.url,
          customTitle: f.title
        })
      );
    }
  }
}
