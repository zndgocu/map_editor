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
