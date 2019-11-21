
const ipcRenderer = window.require("electron").ipcRenderer;

export const Actions = {
   openUrl: function(url) {
    ipcRenderer.send('asynchronous-message', {
      action: "open",
      url: url
    });
  }
};
