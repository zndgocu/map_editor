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