
export let methods = {
  newFeed() {
      this.$buefy.dialog.prompt({
          message: "URL for the new feed?",
          inputAttrs: {
              placeholder: 'Https://yourfavsite.fi/rss'
          },
          trapFocus: true,
          onConfirm: (value) => this.$props.data.newFeed(value)
      });
  }
};
