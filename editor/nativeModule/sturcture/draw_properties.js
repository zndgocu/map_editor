const DrawItem = {
    None: undefined,
    Node: "node",
    Line: "line",
    Plane: "plane",
    Grid: "grid",
    Axes: "axes",
};
Object.freeze(DrawItem);

//function FindDrawItemKeyByValue(itemValue){
//    var key = Object.entries(DrawItem).find(([key, value]) => value == itemValue)[0];
//    return key;
//}

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
