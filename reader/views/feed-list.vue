<template>
  <div id="sidebarDiv">
    <b-menu>
      <b-menu-list>
        <template slot="label">
            <div style="display: flex; flex-direction: row; align-items: center;">
              <p style="flex: 1;" class="subtitle is-3 is-marginless has-text-weight-semibold is-inline-block">Feeds</p>
              <b-button size="is-small" class="is-pulled-right" @click="feedList.forceRefresh()">refresh</b-button>
            </div>
        </template>
        <b-menu-item @click="Transitions.transitionToFeedView(feedList.allCombo)" v-bind:active="true" label="All"></b-menu-item>
        <b-menu-item v-for="feed in feedList.feeds" @click="Transitions.transitionToFeedView(feed)" v-bind:label="feed.title"></b-menu-item>
        <b-menu-item @click="newFeed()" label="Add feed"></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<style lang="scss">
@import "styles/custom-buefy-theme.scss";
#sidebarDiv {
  background-color: $sidebar-color;
  border: solid;
}
</style>

<script>
export default {
  methods: {
    newFeed() {
        this.$buefy.dialog.prompt({
            message: "URL for the new feed?",
            inputAttrs: {
                placeholder: 'Https://yourfavsite.fi/rss'
            },
            trapFocus: true,
            onConfirm: (value) => this.$props.feedList.newFeed(value)
        });
    }
  },
  props: ["feedList"]
};
</script>
