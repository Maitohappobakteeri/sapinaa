import { FeedItemUI } from "./feed-item-ui.mjs";
import { Actions } from "./actions.mjs";

export class FeedUI {
  constructor(feed) {
    this.feed = feed;
    this.isActive = false;
    this.items = feed.items.deriveArray(item => new FeedItemUI(item));

    this.isEditing = false;
    this.edits = {};
    this.resetEdits();
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

  startEditing() {
    this.isEditing = true;
    this.resetEdits();
  }

  saveEdits() {
    this.isEditing = false;
    this.feed.customTitle = this.edits.title;
    this.feed.url = this.edits.url;
    Actions.saveFeeds();
  }

  resetEdits() {
    this.edits.title = this.title;
    this.edits.url = this.feed.url;
  }
}
