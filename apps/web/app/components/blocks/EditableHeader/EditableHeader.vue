<template>
  <!-- The classic standard markup template-->

  <!-- All three elements sticky together -->
  <template v-if="stickyOption === 'fullHeaderSticky'">
    <div style="z-index: 10000" class="sticky top-0">
      <header class="w-full bg-red-500 p-3">
        <p>Header</p>
      </header>
      <nav class="w-full bg-blue-500 p-3">
        <ul>
          <li>Navigation</li>
        </ul>
      </nav>
      <div class="bg-red-500 w-full p-3">
        <p>Test</p>
      </div>
    </div>

    <!-- I would like to use this in general because our layout looks good for us-->
    <!-- What I mean by this just use the old layout we already have-->

    <!-- <header style="z-index: 10000;" class="w-full bg-red-500 p-3 sticky top-0">
        <p>Header</p>
      <nav class="w-full bg-blue-500">
        <ul>
          <li>Home</li>
        </ul>
      </nav>
    </header> -->
  </template>

  <!-- Only header sticky -->
  <template v-else-if="stickyOption === 'headerSticky'">
    <header style="z-index: 10000" class="w-full bg-red-500 p-3 sticky top-0">
      <ul>
        <li>Header</li>
      </ul>
    </header>

    <nav style="z-index: 10000" class="w-full bg-blue-500 p-3">
      <ul>
        <li>Navigation</li>
      </ul>
    </nav>

    <div style="z-index: 10000" class="bg-red-500 w-full p-3">
      <p>Test</p>
    </div>
  </template>

  <!-- Only navigation sticky -->
  <template v-else-if="stickyOption === 'navSticky'">
    <header style="z-index: 10000" class="w-full bg-red-500 p-3">
      <ul>
        <li>Header</li>
      </ul>
    </header>

    <nav style="z-index: 10000" class="w-full bg-blue-500 p-3 sticky top-0">
      <ul>
        <li>Navigation</li>
      </ul>
    </nav>

    <div style="z-index: 10000" class="bg-red-500 w-full p-3">
      <p>Test</p>
    </div>
  </template>

  <!-- Navigation + Test sticky together -->
  <template v-else-if="stickyOption === 'twoDivsSticky'">
    <header style="z-index: 10000" class="w-full bg-red-500 p-3">
      <ul>
        <li>Header</li>
      </ul>
    </header>

    <div style="z-index: 10000" class="sticky top-0">
      <nav class="w-full bg-blue-500 p-3">
        <ul>
          <li>Navigation</li>
        </ul>
      </nav>

      <div class="bg-red-500 w-full p-3">
        <p>Test</p>
      </div>
    </div>
  </template>

  <!-- Header + Test sticky together -->
  <template v-else>
    <div style="z-index: 10000" class="sticky top-0">
      <header class="w-full bg-red-500 p-3">
        <p>Header</p>
      </header>

      <div class="bg-red-500 w-full p-3">
        <p>Test</p>
      </div>
    </div>

    <nav style="z-index: 10000" class="w-full bg-blue-500 p-3">
      <ul>
        <li>Navigation</li>
      </ul>
    </nav>
  </template>
  <!-- Div containing select to choose sticky option thrown random onto the page just to test. This will be later part of the Form component-->
  <div class="w-[400px] fixed right-0 top-200 z-[100000] bg-red-500">
    <SfSelect v-model="stickyOption">
      <option value="fullHeaderSticky">Full Header Sticky</option>
      <option value="headerSticky">Header Sticky</option>
      <option value="navSticky">Navigation Sticky</option>
      <option value="twoDivsSticky">Two divs sticky</option>
      <option value="lastAndFirst">Last and first div sticky</option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const stickyOption = ref('fullHeaderSticky');
</script>
