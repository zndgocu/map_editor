class RenderRepository {
    constructor() {
        this.SelectedFloor = undefined;
        this.Camera = undefined;
        this.Scene = undefined;
        this.Renderer = undefined;
        this.AmbientLight = undefined;
        this.Orbit = undefined;
        this.SceneObjects = {};
        this.SceneObjectScales = {};
        this.FloorObjects = {};
        this.RayCaster = undefined;
    }
    SetFloor(floor) {
        this.SelectedFloor = floor;
    }
    AddFloorObjects(floorId, castObject, isSet) {
        if (this.FloorObjects[floorId] == undefined) {
            this.FloorObjects[floorId] = [];
        }
        this.FloorObjects[floorId].push(castObject);
        if (isSet) {
            this.SetFloor(floorId);
        }
    }
    RayCast(objects, pointer) {
        if (objects == undefined) return undefined;
        this.RayCaster.setFromCamera(pointer, this.Camera);
        return this.RayCaster.intersectObjects(objects, false);
    }
    RayCastFloorObjects(floorId, pointer) {
        var rayObjects = this.FloorObjects[floorId];
        if (rayObjects == undefined) return undefined;
        this.RayCaster.setFromCamera(pointer, this.Camera);
        return this.RayCaster.intersectObjects(rayObjects, false);
    }
    RayCastObjectByType(type, pointer) {
        var rayObjects = this.SceneObjects[type];
        if (rayObjects == undefined) return undefined;
        if (rayObjects.length < 1) return undefined;
        this.RayCaster.setFromCamera(pointer, this.Camera);
        return this.RayCaster.intersectObjects(rayObjects, false);
    }
    GetSceneObjectByTypeAndId(type, id){
        if(this.SceneObjects[type] == undefined) return undefined;
        return this.SceneObjects[type].find(x => x.name == id);
    }

    GetFloorObject(floorId) {
        return this.FloorObjects[floorId];
    }
    GetObjectByTypes(types) {
        var typesArray = new Array();
        for (var i = 0; i < types.length; i++) {
            var objects = this.SceneObjects[types[i]];
            if (objects != undefined && objects.length > 0) {
                for (var iObject = 0; iObject < objects.length; iObject++) {
                    typesArray.push(objects[iObject]);
                }
            }
        }
        return typesArray;
    }
    SetRayCaster(rayCaster) {
        this.RayCaster = rayCaster;
    }
    SetCamera(camera) {
        this.Camera = camera;
    }
    SetScene(scene) {
        this.Scene = scene;
    }
    SetRenderer(renderer) {
        this.Renderer = renderer;
    }
    SetAmbientLight(ambientLight) {
        this.AmbientLight = ambientLight;
        this.Scene.add(this.AmbientLight);
    }
    SetOrbitControl(orbitControl) {
        this.Orbit = orbitControl;
        this.Orbit.screenSpacePanning = false;

        this.Orbit.minDistance = 30;
        this.Orbit.maxDistance = 100000;

        this.Orbit.maxPolarAngle = Math.PI / 2;

        this.Orbit.panSpeed = 0.5;
        this.Orbit.rotateSpeed = 0.5;

        this.Orbit.enabled = true;
        this.Orbit.enablePan = true;
        this.Orbit.enableRotate = true;
        this.Orbit.enableZoom = true;
    }
    GetSceneObjectScaleValue(type) {
        if (this.SceneObjectScales[type] == undefined) return 1;
        return this.SceneObjectScales[type];
    }
    ChangeScale(type, scale) {
        if (this.SceneObjects[type] == undefined) return;

        var changeValue = scale;
        if (this.SceneObjects[type].length < 1) return;
        for (var iObject = 0; iObject < this.SceneObjects[type].length; iObject++) {
            this.SceneObjects[type][iObject].scale.set(changeValue, changeValue, changeValue);
        }
    }
    AddSceneObject(type, id, drawItem, addSceneObjects) {
        if (this.SceneObjects[type] == undefined) {
            this.SceneObjects[type] = [];
        }
        if (addSceneObjects) {
            this.SceneObjects[type].push(drawItem);
        }
        if (this.SceneObjectScales[type] == undefined) {
            this.SceneObjectScales[type] = 1;
        }
        drawItem.ObjectType = type;
        drawItem.name = id;
        this.Scene.add(drawItem);
    }
    RemoveSceneObject(sceneObject) {
        if (sceneObject != undefined) {
            this.Scene.remove(sceneObject);
        }
    }
    Render() {
        if (this.Renderer != undefined) {
            this.Renderer.render(this.Scene, this.Camera);
        }
        if (this.Orbit != undefined) {
            this.Orbit.update();
        }

    }
}
