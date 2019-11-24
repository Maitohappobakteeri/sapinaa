import { FeedItemUI } from "./feed-item-ui.mjs";
import { Actions } from "./actions.mjs";
import { createSortedDerivedArray } from "../models/derived-array.mjs";

export class ComboFeedUI {
  constructor(title, feeds) {
    this.title = title;

    this.items = createSortedDerivedArray(
      item => new FeedItemUI(item),
      (item, next) => item.item.pubDate >= next.item.pubDate,
      (arr, item) => true
    );

    this.isEditing = false;
    this.edits = {};
    this.resetEdits();
  }

  async activate() {
    //this.isActive = true;
  }

  onFeedAdded(feed) {
    feed.items.registerSortedArray(this.items);
  }

  onFeedDeleted(feed) {
    console.log("TODO: Unregister sorted array");
  }

  async refresh(feeds) {

  }

  deactivate() {
    //this.isActive = false;
  }

  startEditing() {
    alert("Not implemented");
    //this.isEditing = true;
    //this.resetEdits();
  }

  saveEdits() {
    this.isEditing = false;
    Actions.saveFeeds();
  }

  resetEdits() {
  }

  deleteFeed() {
    alert("Not implemented");
    //Actions.deleteFeed(this);
  }

  needsRefresh() {
    return false;
  }
}
