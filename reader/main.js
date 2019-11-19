import * as Project from "./project.js";
import { ComponentStrings } from "./views/generated/components.js";

import  { loadTestFeeds } from "./models/feeds.js";
import { cacheFeeds } from "./models/debug-feed-cache.js";

import { FeedListUI } from "./ui/feed-list-ui.js";
import { AppUI } from "./ui/app-ui.js";
import { Transitions } from "./ui/transitions.js";


var Vue = require('vue/dist/vue.js');

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

let feeds = loadTestFeeds("test/testfeeds.json");
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
