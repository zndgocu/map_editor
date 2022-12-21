const PointName = {
    None: undefined,
    FirstPoint: 1,
    SecondPoint: 2
};
Object.freeze(PointName);

const DirectionType = {
    OneWay: 0,
    TwoWay: 1
}
Object.freeze(DirectionType);

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