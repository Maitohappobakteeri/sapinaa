import { TransitionEmitter } from "./transitions";
import { ActionEmitter } from "./actions";
import { Storage } from "../storage";
import { Feed } from "../data/feed";
import { FeedUI } from "./feed-ui";
import { FeedListUI } from "./feed-list-ui";
import { ComboFeedUI } from "./combo-feed-ui";

import { interval } from "rxjs";
import { startWith } from "rxjs/operators";

export class AppUI {
  current: FeedUI | ComboFeedUI;
  feeds: FeedListUI;

  constructor(feedList: FeedListUI) {
    this.current = null;
    this.feeds = feedList;
  }

  async addFeed(feed: Feed) {
    await this.feeds.addFeed(feed);
  }

  async activateFeed(feed: FeedUI | ComboFeedUI) {
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

    ActionEmitter.on("action", (target, _options) => {
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
