<template>
  <div class="container">
    <div style="display: flex; flex-direction: column; height: 100%;" v-if="feed">
      <div id="topbarDiv" class="section" style="padding: 1em;">
        <h1 style="display:inline-block; padding-right: 0em;">{{feed.title}}</h1>
        <b-button size="is-small" class="is-pulled-right" @click="startEditing()">edit</b-button>
        <b-modal :active.sync="isEditing"
                         has-modal-card
                         trap-focus
                         aria-role="dialog"
                         aria-modal>
           <div class="modal-card" style="width: auto">
             <header class="modal-card-head">
                 <p class="modal-card-title">Edit feed</p>
             </header>
             <section class="modal-card-body">
                 <b-field label="Title">
                     <b-input
                         type="text"
                         :value="title"
                         placeholder="Custom title"
                         required>
                     </b-input>
                 </b-field>

                 <b-field label="URL">
                     <b-input
                         type="url"
                         :value="url"
                         placeholder="https://yourfav/rss"
                         required>
                     </b-input>
                 </b-field>
             </section>
             <footer class="modal-card-foot">
                 <button class="button" type="button" @click="isEditing = false">Cancel</button>
                 <button class="button is-danger" type="button" @click="deleteFeed()">Delete</button>
                 <button class="button is-primary" @click="saveEdits()">Save</button>
             </footer>
         </div>
        </b-modal>
      </div>
      <div style="overflow: scroll;">
          <feed-item-short v-for="item in feed.items" v-bind:item="item"></feed-item-short>
      </div>
    </div>
    <div v-else>
      <p> . . . </p>
    </div>
  </div>
</template>

<style lang="scss">
@import "styles/custom-buefy-theme.scss";
#topbarDiv {
  background-color: $sidebar-color;
  border: solid;
}
</style>

<script>
import FeedItemShort from "./feed-item-short.vue";
import { FeedUI } from "../ui/feed-ui.ts";

export default {
  data: () => ({
      isEditing: false,
      title: "",
      url: ""
  }),
  methods: {
    startEditing() {
      if (!(this.$props.feed instanceof FeedUI)) {
        this.$buefy.dialog.alert({
            title: 'Not implemented for special feeds!',
            type: "is-warning"
        });
        return;
      }

      this.isEditing = true;
      this.title = this.$props.feed.title;
      this.url = this.$props.feed.feed.url;
    },

    saveEdits() {
      this.$props.feed.editFeed({
        customTitle: this.title,
        url: this.url
      });
      this.$props.feed.isEditing = false;
    },

    deleteFeed() {
      this.$buefy.dialog.confirm({
          message: "Delete " + this.$props.data.title,
          confirmText: 'Delete',
          type: 'is-danger',
          onConfirm: (value) => this.$props.feed.deleteFeed()
      });
    }
  },
  props: ["feed"],
  components: {
    FeedItemShort
  }
};
</script>
