import { ArcRotateCamera, Color3, DirectionalLight, Engine, HemisphericLight, Mesh, MeshBuilder, PointerEventTypes, PointLight, Scene, SceneLoader, StandardMaterial, Texture, Tools, Vector3, VideoTexture } from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";

export class EntryScene{
    entryScene : Scene;
    constructor(private engine:Engine, private canvas:HTMLCanvasElement, private store:any){
        this.entryScene = this.createEntryScene();
    }

    createEntryScene():Scene{
        const scene = new Scene(this.engine);
        const camera = new ArcRotateCamera("camera",0,0,0,new Vector3(-90, 0, 0),scene);  
        camera.setTarget(new Vector3(-10, -5, 0));
        camera.attachControl(true);
        camera.collisionRadius = new Vector3(0,0,1);
        camera.checkCollisions = true;
        camera.speed = 0.2;

        camera.lowerRadiusLimit = 6;
        camera.upperRadiusLimit = 6;

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.5;
    
        // const light2 = new DirectionalLight("light2", new Vector3(-1, -2, 1), scene);
        // light2.intensity = 0.75;

        // const pl = new PointLight("pl", Vector3.Zero(), scene);
        // pl.diffuse = new Color3(0.96, 0.95, 0.02);
        // pl.specular = new Color3(0.02, 0.96, 0.76);
        // pl.intensity = 0.8;

        this.createBox(scene);

        //speakers
        this.addModel("models/", "speaker.glb", scene , 3, new Vector3(25,5,-25), -130);
        this.addModel("models/", "speaker.glb", scene , 3, new Vector3(25,-5,-25), -130);
        this.addModel("models/", "speaker.glb", scene , 3, new Vector3(25,5,25), 130);
        this.addModel("models/", "speaker.glb", scene , 3, new Vector3(25,-5,25), 130);

        //recliners
        this.addModel("models/", "recliner2.glb", scene , 10, new Vector3(-20,-11,-10), 90);
        this.addModel("models/", "recliner2.glb", scene , 10, new Vector3(-20,-11,10), 90);

        //tea table
        this.addModel("models/", "plywood_tea_table_20.glb", scene , 0.1, new Vector3(-15,-15,0), 90);

        //popcorn
        this.addModel("models/", "popcorn_bowl.glb", scene , 0.3, new Vector3(-20,-8,0), 90);

        //drinks
        this.addModel("models/", "monster_energy_drink.glb", scene , 0.5, new Vector3(-14,-8.5,-1.5), -75);
        this.addModel("models/", "glass_of_tea.glb", scene , 1, new Vector3(-14,-8.5,1.5), -75);


        return scene;
    }

    createBox(scene:Scene){
        const addVideo = true;
        const mat = new StandardMaterial("color", scene);
        mat.diffuseTexture = new Texture("textures/wall/Wood_027_normal.jpg", scene);
        mat.ambientTexture = new Texture("textures/wall/Wood_027_ambientOcclusion.jpg", scene);
        // mat.diffuseTexture.hasAlpha = true;
        mat.backFaceCulling = true;

        const box = MeshBuilder.CreateBox("box", { width : 100, height:30, depth:50, sideOrientation: Mesh.BACKSIDE }, scene);
        box.checkCollisions = true;
        box.material = mat;

        const planeOpts = {
			height: 30, 
			width: 100, 
			sideOrientation: Mesh.DOUBLESIDE};
        const videoPlane = MeshBuilder.CreatePlane("plane", planeOpts, scene);
        videoPlane.position = new Vector3(48,0,0);
        videoPlane.rotation.y = 1.58;

        if(addVideo){
            const ANote0VideoMat = new StandardMaterial("m", scene);
            const ANote0VideoVidTex = new VideoTexture("vidtex","video/Woman - 58142.mp4", scene);
            ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
            ANote0VideoMat.roughness = 1;
            ANote0VideoMat.emissiveColor = Color3.White();
            videoPlane.material = ANote0VideoMat;
            scene.onPointerObservable.add((evt:any)=>{
                    if(evt.pickInfo.pickedMesh === videoPlane){
                        //console.log("picked");
                            if(ANote0VideoVidTex.video.paused)
                                ANote0VideoVidTex.video.play();
                            else
                                ANote0VideoVidTex.video.pause();
                            console.log(ANote0VideoVidTex.video.paused?"paused":"playing");
                    }
            }, PointerEventTypes.POINTERPICK);
        }
    }

    createTrapezium(scene:Scene){
        const myShape = [
            new  Vector3(-0.5, -0.5, 0),
            new  Vector3(0.5, -0.5, 0),
            new  Vector3(0.5, 0.5, 0),
            new  Vector3(-0.5, 0.5, 0)
        ];

        myShape.push(myShape[0]);

         const myPath = [
            new  Vector3(0, -2, 0),
            new  Vector3(0, 2, 0)
        ];

         const scaling = (i:any, distance:number) => {
        return 1 - 0.5*distance;
        };

         const mat = new  StandardMaterial("mat", scene);
        mat.diffuseColor =  Color3.White();
        //mat.wireframe = true;

        //Create extrusion with updatable parameter set to true for later changes
         const box =  MeshBuilder.ExtrudeShapeCustom("box", {shape: myShape, path: myPath, scaleFunction: scaling, sideOrientation:  Mesh.BACKSIDE}, scene);
        box.convertToFlatShadedMesh();
        box.material = mat;
    }

    addModel(rootPath:string, modelName:string, scene:Scene, scaleUnit:number, position:Vector3, rotation:number){
        SceneLoader.LoadAssetContainer(rootPath, modelName, scene, (container) => {

            // Create the 3D UI manager
            const manager = new GUI.GUI3DManager(scene);
            
            // Add loaded file to the scene
            container.addAllToScene();
            
            // Scale and position the loaded model (First mesh loaded from gltf is the root node)
            container.meshes[0].scaling.scaleInPlace(scaleUnit)
            container.meshes[0].position = position;
            container.meshes[0].rotate(new Vector3(0, 0.5, 0), Tools.ToRadians(rotation));
    
            // wrap in bounding box mesh to avoid picking perf hit
            const gltfMesh : any = container.meshes[0];
        });
    }
}