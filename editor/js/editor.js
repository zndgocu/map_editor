(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EDITOR = {}));
}(this, (function (exports) { 'use strict';


//#region const variable
//const __PlaneSuffix = 'plane';
//#endregion

//#region const enum
const PointName = {
    None: undefined,
    FirstPoint: 1,
    SecondPoint: 2
};
const DirectionType = {
    OneWay: 0,
    TwoWay: 1
}
const KeyBoardCode = {
    Shift: 16,
    Ctrl: 17
};
const DrawItem = {
    None: undefined,
    Node: "node",
    Line: "line"
};
function GetDrawItemArrayExceptNone(){
    return Object.values(DrawItem).filter(x => x != DrawItem.None);
}
const DrawItemOther = {
    None: undefined,
    Plane: "plane",
    Grid: "grid",
    Axes: "axes"
}
function GetDrawItemOtherArrayExceptNone(){
    return Object.values(DrawItemOther).filter(x => x != DrawItemOther.None);
}
const MouseButton = {
    Left: 0,
    Middle: 1,
    Right: 2    
}
//#endregion

//#region function
function Matrix(rows, cols, defaultValue) {

    var arr = [];

    // Creates all lines:
    for (var i = 0; i < rows; i++) {

        // Creates an empty line
        arr.push([]);

        // Adds cols to the empty line:
        arr[i].push(new Array(cols));

        for (var j = 0; j < cols; j++) {
            // Initializes:
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}
//#endregion

//#region class
class LineAttribute{
    constructor(){
        this.PointIds = {};
        this.PointPoses = {};
        this.DirectionType = undefined;
    }
    Clear(){
        this.PointIds = {};
        this.PointPoses = {};
        this.DirectionType = undefined;
    }
    SetDirectionType(directionType){
        this.DirectionType = directionType;
    }
    GetDirectionType(){
        return this.DirectionType;
    }
    GetFirstPointPos(){
        return this.GetPointPos(PointName.FirstPoint);
    }
    GetSecondPointPos(){
        return this.GetPointPos(PointName.SecondPoint);
    }    
    GetPointPos(pointName){
        return this.PointPoses[pointName];
    }
    HasFirstPoint(){
        return this.HasPoint(PointName.FirstPoint); 
    }
    HasSecondPoint(){
        return this.HasPoint(PointName.SecondPoint);         
    }
    HasPoint(pointName){
        var point = this.PointIds[pointName];
        return (point != undefined);
    }
    SetLineDrawAttrFirstPointPos(objectId, v3) {
        this.SetLineDrawAttrPointPos(PointName.FirstPoint, objectId, v3);
    }
    SetLineDrawAttrSecondPointPos(objectId, v3) {
        this.SetLineDrawAttrPointPos(PointName.SecondPoint, objectId, v3);        
    }
    SetLineDrawAttrPointPos(pointName, pointId, v3) {
        this.PointIds[pointName] = pointId;
        this.PointPoses[pointName] = v3;        
    }
}
class MapData{
    constructor(){
        this.SizeX = undefined;
        this.SizeY = undefined;
        this.SegmentSize = undefined;
        this.Image64 = undefined;
        this.MapData = undefined;
    }
}
class DeltaRepository{
    constructor(){
        this.AnimateProperties = undefined;
    }
    SetAnimateProperties(prop){
        this.AnimateProperties = prop;
    }
    StartAnim(){
        this.AnimateProperties.Start();
    }
    StopAnim(){
        this.AnimateProperties.Stop();
    }
}
class EditorRepository {
    constructor() {
        this.DrawProperties = undefined;
        this.GridPropertiess = {};
    }
    GetDrawSize(type) {
        return this.DrawProperties.GetDrawSize(type);
    }
    SetDrawSize(type, scale) {
        this.DrawProperties.SetDrawSize(type, scale);
    }
    SelectLine(selectCount, name, position) {
        this.DrawProperties.SelectLine(selectCount, name, position);
    }
    HasLineDrawFirstPoint() {
        return this.HasLineDrawPoint(0);
    }
    HasLineDrawSecondPoint() {
        return this.HasLineDrawPoint(1);
    }
    HasLineDrawPoint(index) {
        return this.DrawProperties.HasLineDrawPoint(index);
    }
    SetDrawProperties(drawProperties) {
        this.DrawProperties = drawProperties;
    }
    AddGridProperties(gridProperties) {
        this.GridPropertiess[gridProperties.Id] = gridProperties;
    }
    SetGridProperties(id, size, segment, grid) {
        this.GridPropertiess[id].SetGrid(size, segment, grid);
    }
    SetLineDrawAttr(lineAttr) {
        this.DrawProperties.SetLineDrawAttr(lineAttr);
    }
    GetMouseOverMesh() {
        return this.DrawProperties.MouseOverMesh;
    }
    GetDrawSelectedItem() {
        return this.DrawProperties.GetDrawSelectedItem();
    }
    GetMouseOverMesh() {
        return this.DrawProperties.MouseOverMesh;
    }
    HasLineDrawAttrFirstPointPos() {
        return this.HasLineDrawAttrPointPos(PointName.FirstPoint);
    }
    HasLineDrawAttrSecondPointPos() {
        return this.HasLineDrawAttrPointPos(PointName.SecondPoint);
    }
    HasLineDrawAttrPointPos(pointName) {
        return this.DrawProperties.HasLineDrawAttrPointPos(pointName);
    }
    GetLineDrawAttrFirstPointPos() {
        return this.GetLineDrawAttrPointPos(PointName.FirstPoint);
    }
    GetLineDrawAttrSecondPointPos() {
        return this.GetLineDrawAttrPointPos(PointName.SecondPoint);
    }
    GetLineDrawAttrPointPos(pointName) {
        return this.DrawProperties.GetLineDrawAttrPointPos(pointName);
    }

    SetLineDrawAttrFirstPointPos(pointId, v3) {
        this.SetLineDrawAttrPointPos(PointName.FirstPoint, pointId, v3);
    }
    SetLineDrawAttrSecondPointPos(pointId, v3) {
        this.SetLineDrawAttrPointPos(PointName.SecondPoint, pointId, v3);
    }
    SetLineDrawAttrPointPos(pointName, pointId, v3) {
        this.DrawProperties.SetLineDrawAttrPointPos(pointName, pointId, v3);
    }
    ClearLineDrawAttr() {
        this.DrawProperties.ClearLineDrawAttr();
    }
    ClearRollOverMesh() {
        this.DrawProperties.ClearRollOverMesh();
    }
}
class InputRepository {
    constructor() {
        this.InputProperties = undefined;
    }
    SetInputProperties(prop) {
        this.InputProperties = prop;
    }
    SetMousePointer(pointer) {
        this.InputProperties.SetMousePointer(pointer);
    }
    SetKeyboardValue(keyCode, value) {
        this.InputProperties.SetKeyBoardValue(keyCode, value);
    }
    GetKeyboardValue(keyCode) {
        return this.InputProperties.GetKeyboardValue(keyCode);
    }
    IsCtrlOn() {
        return this.GetKeyboardValue(KeyBoardCode.Ctrl);
    }
    IsShiftOn() {
        return this.GetKeyboardValue(KeyBoardCode.Shift);
    }

    SetMousePoint(x, y) {
        this.InputProperties.SetMousePoint(x, y);
    }
    GetMousePoint(){
        return this.InputProperties.GetMousePoint();
    }
    SetMouseClick(buttonType, isClick) {
        this.InputProperties.SetMouseClick(buttonType, isClick);
    }
}
class MapRepository {
    constructor() 
    {
        this.RenderBody = undefined;
        this.GridProps = undefined;
    }
    SetRenderBody(renderBody){
        this.RenderBody = undefined;
        this.RenderBody = renderBody;
    }
    SetGridProps(sizeX, sizeY, segment){
        this.GridProps = undefined;
        this.GridProps = new GridProperties();
        this.GridProps.SizeX = sizeX;
        this.GridProps.SizeY = sizeY;
        this.GridProps.Segment = segment;
    }
    GetGridSegmentSize(){
        return this.GridProps.GetSegmentSize();
    }
    GetGridSize(){
        return this.GridProps.GetGridSize();
    }
}
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
    GetSceneObjectByTypes(types){
        var results = new Array();
        for(var iteType = 0; iteType < types.length; iteType++){
            if(this.SceneObjects[types[iteType]] != undefined){
                for(var iteTypeObject = 0; iteTypeObject < this.SceneObjects[types[iteType]].length; iteTypeObject++){
                    results.push(this.SceneObjects[types[iteType]][iteTypeObject]);
                }
            }
        }
        return results;
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
class AnimateProperties {
    construct() {
        this.Stop = true;
        this.FrameCount = 0;
        this.Fps = 0;
        this.FpsInterval = 0;
        this.StartTime = 0;
        this.Now = 0;
        this.Then = 0;
        this.Elapsed = 0;
    }
    Start() {
        this.Then = Date.now();
        this.Fps = 60;
        this.FpsInterval = 1000 / this.Fps;
        this.StartTime = Date.now();
        this.Stop = false;
    }
    Stop(){
        this.Stop = true;
    }
}
class DrawProperties {
    constructor() {
        this.DrawSelectedItem = DrawItem.None;
        this.DrawItemGeometies = {};
        this.DrawItemMaterials = {};
        this.DrawSizes = {};
        this.MouseOverMesh = undefined;

        //special prop
        this.LineDrawAttr = undefined;
    }
    GetLineDrawAttrFirstPointPos() {
        return this.GetLineDrawAttrPointPos(PointName.FirstPoint);
    }
    GetLineDrawAttrSecondPointPos() {
        return this.GetLineDrawAttrPointPos(PointName.SecondPoint);
    }
    GetLineDrawAttrPointPos(PointName) {
        return this.LineDrawAttr.GetPointPos(PointName);
    }

    HasLineDrawAttrFirstPointPos() {
        return this.HasLineDrawAttrPointPos(PointName.FirstPoint);
    }
    HasLineDrawAttrSecondPointPos() {
        return this.HasLineDrawAttrPointPos(PointName.SecondPoint);
    }
    HasLineDrawAttrPointPos(pointName) {
        if (this.GetLineDrawAttrPointPos(pointName) == undefined) {
            return false;
        }
        return true;
    }

    HasLineDrawAttr() {
        return (this.LineDrawAttr != undefined);
    }
    ClearLineDrawAttr() {
        this.LineDrawAttr = undefined;
    }
    SetLineDrawAttr(lineAttr) {
        this.LineDrawAttr = lineAttr;
    }
    ChangeRollOverMesh(mesh) {
        this.MouseOverMesh = mesh;
    }
    GetDrawSize(type) {
        return this.DrawSizes[type];
    }
    SetDrawSize(type, size) {
        this.DrawSizes[type] = size;
    }
    GetSelectedFirstPointPos() {
        return this.GetSelectedPointPos(0);
    }
    GetSelectedSecondPointPos() {
        return this.GetSelectedPointPos(1);
    }
    GetSelectedPointPos(pointName) {
        return this.LineDrawAttr.GetSelectedPointPos(pointName);
    }
    HasLineDrawFirstPoint() {
        this.HasLineDrawPoint(0);
    }
    HasLineDrawSecondPoint() {
        this.HasLineDrawPoint(1);
    }
    HasLineDrawPoint(index) {
        if (this.LineDrawAttr == undefined) return false;
        return this.LineDrawAttr.HasPoint(index);
    }

    AddDrawItemGeoMat(drawItemKey, geo, mat) {
        this.DrawItemGeometies[drawItemKey] = geo;
        this.DrawItemMaterials[drawItemKey] = mat;
    }
    //SetEditorSelectItemByDrawItemValue(value){
    //    var key = FindDrawItemKeyByValue(value);  
    //    if(value != undefined){
    //        this.DrawSelectedItem = key;         
    //    }
    //}
    SetEditorSelectItemByDrawItemKey(item) {
        this.DrawSelectedItem = item;
        this.MouseOverMesh = undefined;
    }
    GetMat(drawItemType, isClone){
        if (isClone) {
            return this.DrawItemMaterials[drawItemType].clone();
        }
        return this.DrawItemMaterials[drawItemType];        
    }
    GetGeo(drawItemType, isClone){
        if (isClone) {
            return this.DrawItemGeometies[drawItemType].clone();
        }
        return this.DrawItemGeometies[drawItemType];        
    }
    GetEditorSelectedGeo(isClone) {
        if (isClone) {
            return this.DrawItemGeometies[this.DrawSelectedItem].clone();
        }
        return this.DrawItemGeometies[this.DrawSelectedItem];
    }
    GetEditorSelectedMat() {
        return this.DrawItemMaterials[this.DrawSelectedItem];
    }

    SetLineDrawAttrFirstPointPos(objectId, v3) {
        this.SetLineDrawAttrPointPos(PointName.FirstPoint, objectId, v3);
    }
    SetLineDrawAttrSecondPointPos(objectId, v3) {
        this.SetLineDrawAttrPointPos(PointName.SecondPoint, objectId, v3);
    }
    SetLineDrawAttrPointPos(pointName, objectId, v3) {
        this.LineDrawAttr.SetLineDrawAttrPointPos(pointName, objectId, v3);
    }
    GetDrawSelectedItem() {
        return this.DrawSelectedItem;
    }
    ClearLineDrawAttr() {
        this.LineDrawAttr.Clear();
    }
    ClearRollOverMesh() {
        if (this.MouseOverMesh == undefined) return;
        if (this.DrawSelectedItem == DrawItem.Line) {
            this.MouseOverMesh.geom;
            var linePositions = this.MouseOverMesh.geometry.attributes.position.array;
            linePositions[0] = 0;
            linePositions[1] = 0;
            linePositions[2] = 0;
            linePositions[3] = 0;
            linePositions[4] = 0;
            linePositions[5] = 0;
            this.MouseOverMesh.geometry.setDrawRange(0, 2);
            this.MouseOverMesh.geometry.attributes.position.needsUpdate = true;
        }
    }
}
class GridProperties {
    constructor(id) {
        this.Id = id;
        this.GridArray = undefined;
        this.SizeX = undefined;
        this.SizeY = undefined;
        this.Segment = undefined;
        this.GridHelper = undefined;
        this.Plane = undefined;
    }
    SetGrid(sizeX, sizeY, seg, girdHelper, gridPlane) {
        this.SizeX = sizeX;
        this.SizeY = sizeY;
        this.Segment = seg;
        this.GridHelper = girdHelper;
        this.GridHelper.name = String(this.Id);
        this.GridPlane = gridPlane;
        this.GridPlane.name = String(this.Id)//qq
        var countSeg = parseInt((this.Size / this.Segment));
        this.GridArray = Matrix(countSeg, countSeg, 0);
    }
    GetSegmentSize() {
        return (this.GetGridSize() / this.Segment);
    }
    GetGridSize() {
        return (this.SizeX > this.SizeY) ? this.SizeX : this.SizeY;
    }
    GetGridSizeX() {
        return this.SizeX;
    }
    GetGridSizeY() {
        return this.SizeY;
    }
}
class InputProperties {
    constructor() {
        this.MousePointer = undefined;
        this.MouseClick = {};
        this.Keyboard = {};
    }
    SetMouseClick(buttonType, isClick){
        this.MouseClick[buttonType] = isClick;
    }
    SetMousePointer(pointer){
        this.MousePointer = pointer;
    }
    SetKeyBoardValue(keyCode, value){
        this.Keyboard[keyCode] = value;
    }
    GetKeyboardValue(keyCode){
        return this.Keyboard[keyCode];
    }
    
    SetMousePoint(x, y){
        this.MousePointer.set(x, y);
    }
    GetMousePoint(){
        if(this.MousePointer == undefined){
            return {
                x: 0,
                y: 0
            };
        }
        return this.MousePointer;        
    }
}
//#endregion


//exports
exports.PointName = PointName;
exports.DirectionType = DirectionType;
exports.KeyBoardCode = KeyBoardCode;
exports.DrawItem = DrawItem;
exports.GetDrawItemArrayExceptNone = GetDrawItemArrayExceptNone;
exports.GetDrawItemOtherArrayExceptNone = GetDrawItemOtherArrayExceptNone;
exports.DrawItemOther = DrawItemOther;
exports.MouseButton = MouseButton;
exports.LineAttribute = LineAttribute;
exports.MapData = MapData;
exports.DeltaRepository = DeltaRepository;
exports.EditorRepository = EditorRepository;
exports.InputRepository = InputRepository;
exports.MapRepository = MapRepository;
exports.PickRepository = PickRepository;
exports.RenderRepository = RenderRepository;
exports.AnimateProperties = AnimateProperties;
exports.DrawProperties = DrawProperties;
exports.GridProperties = GridProperties;
exports.InputProperties = InputProperties;
exports.Matrix = Matrix;
})));