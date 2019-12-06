import * as Project from "./project.ts";
import { Storage } from "./storage.ts";
import { FeedListUI } from "./ui/feed-list-ui.ts";
import { AppUI } from "./ui/app-ui.ts";
import { Transitions } from "./ui/transitions.ts";

import "babel-polyfill";
let Vue = require("vue/dist/vue.js");
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.use(Buefy);

import feedlist from "./views/feed-list.vue";
Vue.component("feed-list", feedlist);
import feed from "./views/feed.vue";
Vue.component("feed", feed);

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

let ui = new AppUI(new FeedListUI());

var vapp = new Vue({
  el: "#main",
  data: {
    app: ui
  }
});

ui.start();
