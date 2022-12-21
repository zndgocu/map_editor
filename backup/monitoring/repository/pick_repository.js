class PickRepository {
    constructor() {
        this.PickRaycaster = undefined;
        this.PickObjects = {};
    }
    SetPickRaycaster(rayCaster) {
        this.PickRaycaster = rayCaster;
    }

    RayCast(objects, pointer, camera) {
        if (objects == undefined) return undefined;
        this.PickRaycaster.setFromCamera(pointer, camera);
        return this.PickRaycaster.intersectObjects(objects, true);
    }
    GetExceptObjects(objArr) {
        var except = [];
        for (const [key, value] of Object.entries(this.PickObjects)) {
            var founds = objArr.filter(x => x.object.name == key);
            if (founds.length < 1) {
                except.push(value);
            }
        }
        return except;
        //objArr.forEach(pick => {
        //    if(this.PickObjects[pick.name] == undefined){
        //        except.push(pick);
        //    }
        //});
        //return except;
    }
    GetObject(key) {
        return this.PickObjects[key];
    }
    Pick(key, obj) {
        this.PickObjects[key] = obj;
    }
    Clear() {
        Object.keys(this.PickObjects).forEach((key) => delete this.PickObjects[key]);
    }
    RemovePickOjbect(key){
        if(this.HasObject(key)){
            delete this.PickObjects[key];
        }
    }
    
    
    
    HasObject(key) {
        var obj = this.PickObjects[key];
        return (obj != undefined);
    }


}
