import { FeedItemUI } from "./feed-item-ui.ts";
import { Actions } from "./actions.mjs";

export class FeedUI {
  constructor(feed) {
    this.feed = feed;
    this.isActive = false;
    this.items = feed.items.deriveArray(item => new FeedItemUI(item));
    this.isEditing = false;
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

  startEditing() {
    this.isEditing = true;
  }

  editFeed(edits) {
    assignIfDef(this.feed, edits, "customTitle");
    assignIfDef(this.feed, edits, "url");
    Actions.saveFeeds();
  }

  needsRefresh() {
    return this.feed.lastFetched === null
        || new Date(Date.now()) - this.feed.lastFetched > 10 * 60 * 1000;
  }
}

function assignIfDef(dst, propSource, prop) {
  if (prop in propSource) {
    dst[prop] = propSource[prop];
  }
}
