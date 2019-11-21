const ipcRenderer = window.require("electron").ipcRenderer;

let loading = [];

ipcRenderer.on('asynchronous-reply', function(event, args) {
  // TODO: Timeout
  if (args.action === "load") {
    let promise = loading.filter(l => l.name === args.name)[0];
    promise.resolve(args.data);
    loading = loading.filter(l => l.name !== args.name);
  }
});


export const Config = {
  load: function(name) {
    return new Promise(function(resolve, reject) {
      loading.push({name: name, resolve: resolve, reject: reject});
      ipcRenderer.send('asynchronous-message', {
        action: "load",
        name: name
      });
    });
  },
  save: function(name, data) {
    ipcRenderer.send('asynchronous-message', {
      action: "save",
      name: name,
      data: data
    });
  }
};
