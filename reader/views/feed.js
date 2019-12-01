import { FeedUI } from "../ui/feed-ui";

export let data = function() {
  return {
      isEditing: false,
      title: "",
      url: ""
  };
};

export let methods = {
  startEditing: function() {
    if (!(this.$props.data instanceof FeedUI)) {
      this.$buefy.dialog.alert({
          title: 'Not implemented for special feeds!',
          type: "is-warning"
      });
      return;
    }

    this.isEditing = true;
    this.title = this.$props.data.title;
    this.url = this.$props.data.feed.url;
  },

  saveEdits: function() {
    this.$props.data.saveEdits({
      customTitle: this.title,
      url: this.url
    });
  },

  deleteFeed: function() {
    this.$buefy.dialog.confirm({
        message: "Delete " + this.$props.data.title,
        confirmText: 'Delete',
        type: 'is-danger',
        onConfirm: (value) => this.$props.data.deleteFeed()
    });
  }
};
