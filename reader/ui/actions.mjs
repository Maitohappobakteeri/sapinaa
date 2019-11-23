import EventEmitter from 'events';
const ipcRenderer = window.require("electron").ipcRenderer;

export const ActionEmitter = new EventEmitter();

export const Actions = {
   openUrl: function(url) {
    ipcRenderer.send('asynchronous-message', {
      action: "open",
      url: url
    });
  },
  saveFeeds: function() {
    setImmediate(() =>
      ActionEmitter.emit("action", "save"));
  }
};
