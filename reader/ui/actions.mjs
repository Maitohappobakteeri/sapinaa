
const ipcRenderer = window.require("electron").ipcRenderer;

export const Actions = {
   openUrl: function(url) {
    // ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg);
    // });
    ipcRenderer.send('asynchronous-message', url);
  }
};
