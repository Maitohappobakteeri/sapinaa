import { Feed } from "../data/feed";
import { FeedUI } from "./feed-ui";
import { Storage } from "../storage";
import { sleep } from "../utility/async";
import { ComboFeedUI } from "./combo-feed-ui";

export class FeedListUI {
  allCombo: ComboFeedUI;
  feeds: FeedUI[];
  nextUID: number | undefined;

  constructor() {
    this.allCombo = new ComboFeedUI("All");
    this.feeds = [];

    this.nextUID = undefined;
  }

  getNextUID() {
    let uid = this.nextUID;
    this.nextUID += 1;
    return uid;
  }

  lazyRefresh() {
    console.log("Refreshing feeds");
    setImmediate(
      async function() {
        for (let f of this.feeds) {
          if (f.needsRefresh()) {
            f.refresh();
          }
          await sleep(500);
        }
      }.bind(this)
    );
  }

  forceRefresh() {
    console.log("Force refreshing feeds");
    setImmediate(
      async function() {
        for (let f of this.feeds) {
          f.refresh();
          await sleep(500);
        }
      }.bind(this)
    );
  }

  async newFeed(newUrl) {
    let feed = new Feed({
      uid: this.getNextUID(),
      url: newUrl
    });
    await this.addFeed(feed);
    this.saveFeeds();
  }

  async addFeed(feed) {
    if (feed.uid === undefined) {
      feed.uid = this.getNextUID();
    }

    await feed.load();
    this.feeds.push(new FeedUI(feed));

    this.allCombo.onFeedAdded(feed);
  }

  deleteFeed(feed) {
    this.feeds = this.feeds.filter(f => f !== feed);
    this.saveFeeds();

    this.allCombo.onFeedDeleted(feed);
  }

  async activateFeed(feed) {
    console.log("Activating feed", feed.title);
    this.feeds.filter(f => f !== feed).forEach(f => f.deactivate());
    await feed.activate();
  }

  get defaultFeed() {
    return this.allCombo;
  }

  saveFeeds() {
    let compactFeeds = this.feeds
      .map(f => f.feed)
      .map(f => {
        return {
          uid: f.uid,
          title: f.customTitle,
          url: f.url,
          lastFetched: f.lastFetched
        };
      });
    Storage.save("feeds.json", { nextUID: this.nextUID, feeds: compactFeeds });
  }
}
