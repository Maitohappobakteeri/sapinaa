<template>
  <article @click="item.openWebPage()" class="message is-dark">
    <div class="message-header">
      <p>{{item.headline}}</p>
      <p class="is-pulled-right">{{item.timeSincePublish}}</p>
    </div>
    <div v-if="item.description" class="message-body">
      <p>{{item.description}}</p>
    </div>
  </article>
</template>
<script>
export default {
  props: ["item"]
};
</script>
