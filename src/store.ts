import { defineStore } from "pinia";
import { SceneToShow } from "./Scenes/SceneToShow";
export const store = defineStore({
  id: "virtual-t",
  state: () => ({
    sceneToShow: SceneToShow.Entry as SceneToShow
  }),
  getters: {
    getSceneToShow(): SceneToShow {
      return this.sceneToShow;
    }
  },
  actions: {
    changeScene(sceneToShow: SceneToShow) {
      console.log("Scene change to : ", sceneToShow);
      this.sceneToShow = sceneToShow;
    }
  }
});
