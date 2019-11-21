import * as Project from "./project.mjs";
import { Config } from "./config.mjs";
import components from "./views/**/*.html";

import { Feeds } from "./models/feeds.mjs";
import { Feed } from "./models/feed.mjs";
// import { cacheFeeds } from "./models/debug-feed-cache.mjs";

import { FeedListUI } from "./ui/feed-list-ui.mjs";
import { AppUI } from "./ui/app-ui.mjs";
import { Transitions } from "./ui/transitions.mjs";

import "babel-polyfill";
let Vue = require("vue/dist/vue.js");

for (var comp in components) {
    if (Object.prototype.hasOwnProperty.call(components, comp)) {
      Vue.component(comp, {
        props: ["data"],
        template: components[comp]
      });
    }
}

Vue.mixin({
  data: function() {
    return {
      get Transitions() {
        return Transitions;
      },
      get Project() {
        return Project;
      }
    };
  }
});

// Config.save("feeds.json", feeds.feeds.map(f => {
//   return { title: f.title, url: f.url };
// }));

let feeds = new Feeds();

let ui = new AppUI(
  new FeedListUI(feeds)
);

Config.load("feeds.json").then(data => {
  data.forEach(f => {
    ui.feeds.addFeed(new Feed(f.title, f.url));
  });
});

var vapp = new Vue({
  el: '#main',
  data: {
    app: ui
  }
});

ui.registerEvents();
