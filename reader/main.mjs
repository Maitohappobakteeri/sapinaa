import * as Project from "./project.mjs";
import { ComponentStrings } from "./views/generated/components.mjs";

import  { loadTestFeeds } from "./models/feeds.mjs";
// import { cacheFeeds } from "./models/debug-feed-cache.mjs";

import { FeedListUI } from "./ui/feed-list-ui.mjs";
import { AppUI } from "./ui/app-ui.mjs";
import { Transitions } from "./ui/transitions.mjs";

import "babel-polyfill";
let Vue = require("vue/dist/vue.js");

ComponentStrings.forEach(c => {
  Vue.component(c.name, {
    props: c.props,
    template: c.template
  });
});

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

let feeds = loadTestFeeds();
let ui = new AppUI(
  new FeedListUI(feeds),
  feeds.feeds[0]
);

var vapp = new Vue({
  el: '#main',
  data: {
    app: ui
  }
});

ui.registerEvents();
