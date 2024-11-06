<template>
  <article class="demo-area">
    <!--      <img-->
    <!--        class="demo-trigger"-->
    <!--        src="https://demos.imgix.net/wristwatch.jpg?w=200&ch=DPR&dpr=2&border=1,ddd"-->
    <!--        data-zoom="https://demos.imgix.net/wristwatch.jpg?w=1000&ch=DPR&dpr=2"-->
    <!--      />-->
    <slot></slot>
  </article>
</template>

<script setup lang="ts">
import Drift from 'drift-zoom';

onMounted(() => {
  let demoTrigger = document.querySelector('.demo-trigger') as HTMLElement;
  let paneContainer = document.querySelector('.detail') as HTMLElement;

  new Drift(demoTrigger, {
    paneContainer: paneContainer,
    inlinePane: 1,
  });
});
</script>

<style scoped>
.demo-trigger {
  display: inline-block;
  width: 30%;
}

.detail {
  position: relative;
  width: 65%;
  margin-left: 5%;
  float: left;
  button {
    vertical-align: middle;
    opacity: 0.5;
    cursor: unset;
    background: $color_invert_chrome_tint;
    margin-left: 1em;
  }
}

@media (max-width: 610px) {
  .detail,
  .demo-trigger {
    float: none;
  }

  .demo-trigger {
    display: block;
    width: 50%;
    max-width: 200px;
    margin: 0 auto;
  }

  .detail {
    margin: 0;
    width: auto;
  }

  p {
    margin: 0 auto 1em;
  }

  .responsive-hint {
    display: none;
  }
  h3 {
    margin-top: 20px;
  }
}
</style>
