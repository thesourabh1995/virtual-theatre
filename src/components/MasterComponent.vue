<template>
  <div class="main-wrapper">
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { store } from "../store";
import {SceneMaster} from '../Scenes/SceneMaster';

export default defineComponent({
  name: 'VT',
  mounted() {
    const sceneToShowStore = store();
    const canvas = document.querySelector("canvas")!;
    new SceneMaster(canvas, sceneToShowStore);
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
