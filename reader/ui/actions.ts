import { EventEmitter } from "events";
import { FeedUI } from "./feed-ui";
const ipcRenderer = window.require("electron").ipcRenderer;

export const ActionEmitter = new EventEmitter();

export const Actions = {
  openUrl: function(url: string) {
    ipcRenderer.send("asynchronous-message", {
      action: "open",
      url: url
    });
  },
  saveFeeds: function() {
    setImmediate(() => ActionEmitter.emit("action", "save"));
  },
  deleteFeed: function(feed: FeedUI) {
    setImmediate(() => ActionEmitter.emit("action", "delete", { feed: feed }));
  }
};
