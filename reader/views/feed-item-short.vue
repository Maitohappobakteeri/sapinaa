<template>
  <article @click="data.openWebPage()" class="message is-dark">
    <div class="message-header">
      <p>{{data.headline}}</p>
      <p class="is-pulled-right">{{data.timeSincePublish}}</p>
    </div>
    <div class="message-body">
      <p>{{data.description}}</p>
    </div>
  </article>
</template>
<script>
export default {
  props: ["data"]
};
</script>
