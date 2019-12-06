const ipcRenderer = window.require("electron").ipcRenderer;

let loading = [];

function takePromise(fileName) {
  let promise = loading.filter(l => l.name === fileName)[0];
  if (promise !== undefined) {
    loading = loading.filter(l => l.name !== fileName);
  }
  return promise;
}

ipcRenderer.on("asynchronous-reply", function(event, args) {
  if (args.action === "load") {
    let promise = takePromise(args.name);
    promise.resolve(args.data);
  }
});

export const Storage = {
  load: function(name): Promise<any> {
    return new Promise(function(resolve, reject) {
      loading.push({ name: name, resolve: resolve, reject: reject });
      ipcRenderer.send("asynchronous-message", {
        action: "load",
        name: name
      });
    });

    setTimeout(function() {
      let promise = takePromise(name);
      if (promise !== undefined) {
        promise.reject();
      }
    }, 30 * 1000);
  },
  save: function(name, data) {
    ipcRenderer.send("asynchronous-message", {
      action: "save",
      name: name,
      data: data
    });
  }
};
