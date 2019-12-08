const ipcRenderer = window.require("electron").ipcRenderer;

type PendingLoad = {
  name: string;
  resolve: (value?: any) => void;
  reject: (value?: any) => void;
};

let loading: PendingLoad[] = [];

function takePromise(fileName: string) {
  let promise = loading.filter(l => l.name === fileName)[0];
  if (promise !== undefined) {
    loading = loading.filter(l => l.name !== fileName);
  }
  return promise;
}

ipcRenderer.on("asynchronous-reply", function(_event: any, args: any) {
  if (args.action === "load") {
    let promise = takePromise(args.name);
    promise.resolve(args.data);
  }
});

export const Storage = {
  load: function(name: string): Promise<any> {
    setTimeout(function() {
      let promise = takePromise(name);
      if (promise !== undefined) {
        promise.reject();
      }
    }, 30 * 1000);

    return new Promise(function(resolve, reject) {
      loading.push({ name: name, resolve: resolve, reject: reject });
      ipcRenderer.send("asynchronous-message", {
        action: "load",
        name: name
      });
    });
  },

  save: function(name: string, data: any) {
    ipcRenderer.send("asynchronous-message", {
      action: "save",
      name: name,
      data: data
    });
  }
};
