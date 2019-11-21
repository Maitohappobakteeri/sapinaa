import { FeedItemUI } from "./feed-item-ui.mjs";

export class FeedUI {
  constructor(feed) {
    this.feed = feed;
    this.isActive = false;
    this.items = feed.items.deriveArray(item => new FeedItemUI(item));
  }

  get title() {
    return this.feed.customTitle || this.feed.title;
  }

  activate() {
    this.feed.refresh();
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}
