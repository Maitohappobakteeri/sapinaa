import * as Project from "./project.mjs";
import { Storage } from "./storage.mjs";
import components from "./views/**/*.html";

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
