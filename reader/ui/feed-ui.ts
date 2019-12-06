import { FeedItemUI } from "./feed-item-ui";
import { Actions } from "./actions";
import { Feed } from "../data/feed";
import { FeedItem } from "../data/feed-item";

export class FeedUI {
  feed: Feed;
  isActive: boolean;
  items: FeedItemUI[];

  constructor(feed: Feed) {
    this.feed = feed;
    this.isActive = false;
    this.items = feed.items.deriveArray(
      (item: FeedItem) => new FeedItemUI(item)
    );
  }

  get title() {
    return this.feed.customTitle || this.feed.title;
  }

  async activate() {
    this.isActive = true;
    if (this.needsRefresh()) {
      console.log("Refreshing activated feed");
      await this.refresh();
    }
  }

  async refresh() {
    await this.feed.refresh();
  }

  deactivate() {
    this.isActive = false;
  }

  deleteFeed() {
    Actions.deleteFeed(this);
  }

  editFeed(edits: any) {
    assignIfDef(this.feed, edits, "customTitle");
    assignIfDef(this.feed, edits, "url");
    Actions.saveFeeds();
  }

  needsRefresh() {
    return (
      this.feed.lastFetched === null ||
      Date.now() - this.feed.lastFetched.getTime() > 10 * 60 * 1000
    );
  }
}

function assignIfDef(dst: any, propSource: any, prop: string) {
  if (prop in propSource) {
    dst[prop] = propSource[prop];
  }
}
