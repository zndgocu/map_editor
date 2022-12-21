const __PlaneSuffix = 'plane';
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
        this.GridPlane.name = String(this.Id).concat(__PlaneSuffix);
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
