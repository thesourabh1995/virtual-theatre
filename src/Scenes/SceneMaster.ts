import { Engine, Scene } from "@babylonjs/core";
import { EntryScene } from "./EntryScene";
import { SceneToShow } from "./SceneToShow";

export class SceneMaster{
    engine : Engine;
    entryScene : Scene;
    
    constructor(private canvas: HTMLCanvasElement, private store:any){
        this.engine = new Engine(this.canvas, true);
        this.entryScene = new EntryScene(this.engine, canvas, store).entryScene;

        this.engine.runRenderLoop(() => {
            if(store.sceneToShow === SceneToShow.Entry){
                this.entryScene.render();
            }
        });
    }
}