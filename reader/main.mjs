import * as Project from "./project.mjs";
import { Storage } from "./storage.mjs";
import { FeedListUI } from "./ui/feed-list-ui.mjs";
import { AppUI } from "./ui/app-ui.mjs";
import { Transitions } from "./ui/transitions.mjs";

import "babel-polyfill";
let Vue = require("vue/dist/vue.js");
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

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

let ui = new AppUI(
  new FeedListUI()
);

var vapp = new Vue({
  el: '#main',
  data: {
    app: ui
  }
});

ui.start();
