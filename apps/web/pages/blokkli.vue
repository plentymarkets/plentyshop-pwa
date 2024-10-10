<template>
  <BlokkliProvider entity-type="content" entity-bundle="blog_post" entity-uuid="1" :can-edit="true">
    <BlokkliField :list="blocks" name="blocks" />
  </BlokkliProvider>
</template>

<script lang="ts" setup>
const blocks = [
  {
    uuid: '96f7fbda-04d9-4662-9a6c-6aa3bcf964f2',
    bundle: 'title',
    props: {
      title: 'Hello world',
    },
  },
];
</script>
