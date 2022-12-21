var __SELECTED_FLOOR = 'floor1';
var __SPHERE_RADIUS = 15;
var __SPHERE_WIDTH_SEGMENT = 32;
var __SPHERRE_HEIGHT_SEGMENT = 16;
var __LINE_MAX_POINT = 500;

var __PICK_HEX = 0x0000ff;

var __SIZE_SPHERE = 1;
var __SIZE_LINE = 3;

var OpenMapAttr = new OpenMap();
var UploadMapAttr = new UploadMap();


function UploadLoadLoading() {
    var image = new Image();
    image.src = self.UploadMapAttr.Image64;
    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function () {
        texture.needsUpdate = true;
    };
    InitializePickRepository();
    InitializeMapRepository('render-container', self.UploadMapAttr.MapData.global.MapSizeX, self.UploadMapAttr.MapData.global.MapSizeY, self.UploadMapAttr.MapData.global.MapSegmentSize);
    InitializeDeltaRepository();
    InitializeRenderRepository();
    InitializeEditorRepository(['floor1'], texture);
    InitializeInputRepository();
    InitializeAxes('GlobalAxes');
    InitializeHandler(); //orbitcontrols의 생성이 완료된 이후에 진행되어야 합니다.
    InitializeMapData(self.UploadMapAttr.MapData);
    StartAnimate();
}

//항상 노드가 먼저 저장되기 때문에 정렬할 필요는 없음
//mat, geo clone 동작 안하고 mesh clone해서 프로퍼티 전체복사해오는게 좋음
//rollover 관련 로직 수정해야해서 뒤로 미룸
function InitializeMapData(mapData) {
    Object.entries(mapData).forEach(data => {
        var jsonObjectsType = data[0];
        var jsonObjects = data[1];
        var scale = self._editorRepository.GetDrawSize(jsonObjectsType);
        if (jsonObjectsType == undefined) return;
        if (jsonObjectsType == 'global') return;
        if (jsonObjects == undefined) return; 
        if (jsonObjects.length < 1) return;
        if (jsonObjectsType == 'line') {

            jsonObjects.forEach(obj => {
                var id = obj.Id;
                var cloneGeo = new THREE.BufferGeometry();
                var cloneMat = new THREE.LineBasicMaterial({
                    color: 0xff0000,
                    linewidth: __SIZE_LINE
                });
                var attr = new LineAttribute();
                var firstNodeObject = self._renderRepository.GetSceneObjectByTypeAndId(DrawItem.Node, obj.NodeIds[0]);
                var firstNodePosV3 = new THREE.Vector3(firstNodeObject.position.x, firstNodeObject.position.y, firstNodeObject.position.z);
                var secondNodeObject = self._renderRepository.GetSceneObjectByTypeAndId(DrawItem.Node, obj.NodeIds[1]);
                var secondNodePosV3 = new THREE.Vector3(secondNodeObject.position.x, secondNodeObject.position.y, secondNodeObject.position.z);
                attr.SetLineDrawAttrFirstPointPos(firstNodeObject.name, new THREE.Vector3(firstNodePosV3.x, firstNodePosV3.y, firstNodePosV3.z));
                attr.SetLineDrawAttrSecondPointPos(secondNodeObject.name, new THREE.Vector3(secondNodePosV3.x, secondNodePosV3.y, secondNodePosV3.z));

                var positions = new Float32Array(__LINE_MAX_POINT * 3);
                positions[0] = firstNodePosV3.x;
                positions[1] = firstNodePosV3.y;
                positions[2] = 10;
                positions[3] = secondNodePosV3.x;
                positions[4] = secondNodePosV3.y;
                positions[5] = 10;
                cloneGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                cloneGeo.setDrawRange(0, 2); // draw 2 point
                var mesh = new THREE.Line(cloneGeo, cloneMat);
                mesh.geometry.computeBoundingSphere();
                mesh.name = id;
                mesh.LineDrawAttr = attr;
                self._renderRepository.AddSceneObject(jsonObjectsType, id, mesh, true);
                mesh.geometry.attributes.position.needsUpdate = true;
            });

        } else if (jsonObjectsType == 'node') {
            jsonObjects.forEach(obj => {
                var cloneGeo = new THREE.SphereGeometry(__SPHERE_RADIUS, __SPHERE_WIDTH_SEGMENT, __SPHERRE_HEIGHT_SEGMENT);
                var cloneMat = new THREE.MeshBasicMaterial({
                    color: 0xff0000
                });
                //var cloneGeo = self._editorRepository.DrawProperties.GetGeo(jsonObjectsType);
                //var cloneMat = self._editorRepository.DrawProperties.GetGeo(jsonObjectsType);
                var mesh = new THREE.Mesh(cloneGeo, cloneMat);
                var id = obj.Id;
                mesh.name = id;
                self._renderRepository.AddSceneObject(jsonObjectsType, id, mesh, true);
                mesh.position.set(obj.Point.X, obj.Point.Y, obj.Point.Z);
                mesh.scale.set(scale, scale, scale);
            });
        }
    });
}

function OpenLoadLoading() {
    var image = new Image();
    image.src = self.OpenMapAttr.Image64;
    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function () {
        texture.needsUpdate = true;
    };

    InitializePickRepository();
    InitializeMapRepository('render-container', self.OpenMapAttr.SizeX, self.OpenMapAttr.SizeY, self.OpenMapAttr.SegmentSize);
    InitializeDeltaRepository();
    InitializeRenderRepository();
    InitializeEditorRepository(['floor1'], texture);
    InitializeInputRepository();
    InitializeAxes('GlobalAxes');
    InitializeHandler(); //orbitcontrols의 생성이 완료된 이후에 진행되어야 합니다.
    StartAnimate();
}

window.onload = function () {
    //open
    OpenImagePath = document.querySelector('#open-image-path');
    OpenImagePath.addEventListener('change', self.GetOpenImagePath);

    OpenOk = document.querySelector('#open-ok');
    OpenOk.addEventListener('click', self.OpenMapOk);
    //--open

    //upload    
    UploadImageMap = document.querySelector('#upload-image-map');
    UploadImageMap.addEventListener('change', self.GetUploadImageMap);

    UploadJsonMap = document.querySelector('#upload-json-map');
    UploadJsonMap.addEventListener('change', self.GetUploadJsonMap);

    UploadOk = document.querySelector('#upload-ok');
    UploadOk.addEventListener('click', self.UploadMapOk);
    //--upload
}
//upload
async function GetUploadImageMap(event) {
    const file = event.target.files[0];
    const base64 = await ConvertBase64(file);
    self.UploadMapAttr.Image64 = base64;
}
async function GetUploadJsonMap(event) {
    const file = event.target.files[0];
    var json = await ParseJsonFile(file);
    self.UploadMapAttr.MapData = json;
}
async function ParseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}

function UploadMapOk() {
    $("#dialog-div-upload").dialog('close');
    $("#dialog-div-upload").dialog('destroy').remove();

    self.UploadLoadLoading();
}
//--upload


//oepn
async function GetOpenImagePath(event) {
    const file = event.target.files[0];
    const base64 = await ConvertBase64(file);
    self.OpenMapAttr.Image64 = base64;
}

function OpenMapOk() {
    self.OpenMapAttr.SizeX = parseFloat($('#open-map-size-x').val());
    self.OpenMapAttr.SizeY = parseFloat($('#open-map-size-y').val());
    self.OpenMapAttr.SegmentSize = parseFloat($('#open-map-segment').val());
    $("#dialog-div-open").dialog('close');
    $("#dialog-div-open").dialog('destroy').remove();

    self.OpenLoadLoading();
}

async function GetOpenFileImage(event) {
    const file = event.target.files[0];
    const base64 = await ConvertBase64(file);
    self.EX_RESULT_BASE64 = base64;
}

const ConvertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};
//--open




function GetDistance(x1, y1, x2, y2) {
    var disX = x1 - x2;
    var disY = y1 - y2;
    var dist = Math.sqrt(Math.abs(disX * disX) + Math.abs(disX * disY));
    return dist;
}

function ChangeText_DlgMouseText(text) {
    $('#dlg-mouse-text').text(text);
}

function ChangePosition_DlgMouse(x, y) {
    $('#dlg-mouse').css('left', String(x) + 'px');
    $('#dlg-mouse').css('top', String(y) + 'px');
}

function Changevisibility_DlgMouse(isVisbile) {
    if (isVisbile) {
        $('#dlg-mouse').css('visibility', 'visible');
    } else {
        $('#dlg-mouse').css('visibility', 'hidden');
    }
}

/*ui handler*/
function OnClickButton(buttonName) {
    if (buttonName == 'Test') {
        Test();
    } else if (buttonName == 'Initialize') {
        Initialize('render-container', 1000, 100);
    } else if (buttonName == 'InitializeThree') {
        InitializeThree();
    } else if (buttonName == 'InitializeAxes') {
        InitializeAxes('GlobalAxes');
    } else if (buttonName == 'StartAnimate') {
        StartAnimate();
    } else if (buttonName == 'InitializeHandler') {
        InitializeHandler();
    } else if (buttonName == 'MapOpen') {
        $("#dialog-div-open").css('visibility', 'visible');
        $("#dialog-div-open").dialog({
            open: function (event, ui) {
                //do nothing
            },
            close: function (event, ui) {
                //do nothing
            },
            draggable: false,
        });
    } else if (buttonName == 'MapUpload') {
        $("#dialog-div-upload").css('visibility', 'visible');
        $("#dialog-div-upload").dialog({
            open: function (event, ui) {
                //do nothing
            },
            close: function (event, ui) {
                //do nothing
            },
            draggable: false,
        });
    } else if (buttonName == 'MapDownload') {
        var jsonExportObjects = {};
        var jsonExportData = undefined;

        var exportObjectTypes = new Array();
        exportObjectTypes.push(DrawItem.Node);
        exportObjectTypes.push(DrawItem.Line);
        var exportObjects = self._renderRepository.GetObjectByTypes(exportObjectTypes);

        //global data
        {
            var insertData = undefined;
            insertData = {
                MapSize: self._mapRepository.GetGridSize(),
                MapSegmentSize: self._mapRepository.GetGridSegmentSize()
            };
            jsonExportObjects['global'] = insertData;
        }
        //--global data

        for (var iteObject = 0; iteObject < exportObjects.length; iteObject++) {
            if (exportObjects[iteObject].ObjectType == undefined) continue;
            if (jsonExportObjects[exportObjects[iteObject].ObjectType] == undefined) {
                jsonExportObjects[exportObjects[iteObject].ObjectType] = new Array();
            }
            var insertData = undefined;

            if (exportObjects[iteObject].ObjectType == DrawItem.Node) {
                insertData = {
                    Id: exportObjects[iteObject].name,
                    NodeType: ['NotImplementNodeType1', 'NotImplementNodeType2'],
                    NodeName: 'NotImplementNodeName',
                    Point: {
                        X: exportObjects[iteObject].position.x,
                        Y: exportObjects[iteObject].position.y,
                        Z: exportObjects[iteObject].position.z
                    },
                    Zone: ['NotImplemenntZone1', 'NotImplemenntZone2']
                };
            } else if (exportObjects[iteObject].ObjectType == DrawItem.Line) {
                insertData = {
                    Id: exportObjects[iteObject].name,
                    Direction: 'NotImplemnetDirection',
                    NodeIds: [
                                exportObjects[iteObject].LineDrawAttr.PointIds[PointName.FirstPoint],
                                exportObjects[iteObject].LineDrawAttr.PointIds[PointName.SecondPoint],
                             ]
                };
            }

            if (insertData != undefined) {
                jsonExportObjects[exportObjects[iteObject].ObjectType].push(insertData);
            }
        }
        jsonExportData = JSON.stringify(jsonExportObjects);
        Download('Map.json', jsonExportData);
    }
}

function Download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function OnClickScaleSet(itemName) {
    if (itemName == DrawItem.None || itemName == DrawItem.Line) {
        return;
    } else if (itemName == DrawItem.Node) {
        var scaleValue = parseFloat($('#nodeScale').val());
        self._editorRepository.SetDrawSize(DrawItem.Node, scaleValue);
        var drawScale = self._editorRepository.GetDrawSize(DrawItem.Node);
        self._renderRepository.ChangeScale(DrawItem.Node, drawScale);
    }
}

function OnClickItem(itemName) {
    if (itemName == DrawItem.None) {
        return;
    } else {
        var key = itemName;
        if (key != undefined) {
            if (self._editorRepository.DrawProperties.DrawSelectedItem != key) {
                //the selected mesh removed on scene
                self._renderRepository.RemoveSceneObject(self._editorRepository.DrawProperties.MouseOverMesh);

                // the mesh writed name
                self._editorRepository.DrawProperties.SetEditorSelectItemByDrawItemKey(key);

                //new mesh
                //specially - line
                var geo = self._editorRepository.DrawProperties.GetEditorSelectedGeo().clone();
                var mat = self._editorRepository.DrawProperties.GetEditorSelectedMat().clone();
                var drawScale = self._editorRepository.GetDrawSize(key);

                if (key == DrawItem.Line) {
                    var linePositions = new Float32Array(__LINE_MAX_POINT * 3);
                    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                    geo.setDrawRange(0, 2); // draw 2 point
                    mesh = new THREE.Line(geo, mat);
                    self._editorRepository.SetLineDrawAttr(new LineAttribute());
                } else {
                    mesh = new THREE.Mesh(geo, mat);
                    mesh.scale.set(drawScale, drawScale, drawScale);
                }
                self._editorRepository.DrawProperties.ChangeRollOverMesh(mesh);
                self._renderRepository.AddSceneObject(DrawItem.Node, key, self._editorRepository.DrawProperties.MouseOverMesh, false);
            }
        }
    }
}
/*ui handelr*/

let _mapRepository = undefined;
let _deltaRepository = undefined;
let _renderRepository = undefined;
let _editorRepository = undefined;
let _inputRepository = undefined;
let _pickRepository = undefined;

//step by step
// Initialize('render-container', 1000, 1000, 10, 10)
// InitializeThree()
// InitializeGrid('floor1')
// StartAnimate()
// InitializeHandler()

function Test() {
    InitializePickRepository();
    InitializeMapRepository('render-container', 100, 100, 10);
    InitializeDeltaRepository();
    InitializeRenderRepository();
    InitializeEditorRepository(['floor1']);
    InitializeInputRepository();
    InitializeAxes('GlobalAxes');
    InitializeHandler(); //orbitcontrols의 생성이 완료된 이후에 진행되어야 합니다.
    StartAnimate();
}

function InitializePickRepository() {
    self._pickRepository = new PickRepository();
    var rayCaster = new THREE.Raycaster();
    rayCaster.params.Line.threshold = 1;
    self._pickRepository.SetPickRaycaster(rayCaster);
}

function InitializeDeltaRepository() {
    self._deltaRepository = new DeltaRepository();
    self._deltaRepository.SetAnimateProperties(new AnimateProperties());
}

function InitializeInputRepository() {
    self._inputRepository = new InputRepository();
    self._inputRepository.SetInputProperties(new InputProperties());
    self._inputRepository.SetMousePointer(new THREE.Vector2());
    self._inputRepository.SetMousePoint(0, 0);
}

function InitializeEditorRepository(grids, texture) {
    self._editorRepository = new EditorRepository();

    //drawitem.for
    self._editorRepository.SetDrawProperties(new DrawProperties());
    //node
    var sphereGeo = new THREE.SphereGeometry(__SPHERE_RADIUS, __SPHERE_WIDTH_SEGMENT, __SPHERRE_HEIGHT_SEGMENT);
    var sphereMat = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    self._editorRepository.DrawProperties.AddDrawItemGeoMat(DrawItem.Node, sphereGeo, sphereMat);

    //line
    var drawScale = self._editorRepository.GetDrawSize(DrawItem.Line);
    var lineGeo = new THREE.BufferGeometry();
    var lineMat = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: __SIZE_LINE
    });
    self._editorRepository.DrawProperties.AddDrawItemGeoMat(DrawItem.Line, lineGeo, lineMat);


    for (iGrid = 0; iGrid < grids.length; iGrid++) {
        var gridProperties = new GridProperties(grids[iGrid]);
        var gridPlaneGeo = new THREE.PlaneGeometry(self._mapRepository.GridProps.GetGridSizeX(), self._mapRepository.GridProps.GetGridSizeY());
        var gridMat = undefined;
        if (texture != undefined) {
            gridMat = new THREE.MeshBasicMaterial({
                visible: true,
                map: texture
            });
        } else {
            gridMat = new THREE.MeshBasicMaterial({
                visible: false
            });
        }
        var gridPlane = new THREE.Mesh(gridPlaneGeo, gridMat);
        var gridHelper = new THREE.GridHelper(self._mapRepository.GridProps.GetGridSize(), self._mapRepository.GridProps.Segment);
        gridHelper.rotateX(Math.PI / 2);
        gridProperties.SetGrid(self._mapRepository.GridProps.GetGridSizeX(), self._mapRepository.GridProps.GetGridSizeY(), self._mapRepository.GridProps.Segment, gridHelper, gridPlane);
        self._editorRepository.AddGridProperties(gridProperties);
    }

    for (const [key, value] of Object.entries(self._editorRepository.GridPropertiess)) {
        self._renderRepository.AddFloorObjects(key, value.GridPlane, true);
        self._renderRepository.AddSceneObject(DrawItem.Plane, value.GridPlane.name, value.GridPlane, true);
        self._renderRepository.AddSceneObject(DrawItem.Grid, value.GridHelper.name, value.GridHelper, true);
    }

    self._editorRepository.DrawProperties.SetDrawSize(DrawItem.Node, __SIZE_SPHERE);
    self._editorRepository.DrawProperties.SetDrawSize(DrawItem.Line, __SIZE_LINE);
}

function InitializeMapRepository(containerId, sizeX, sizeY, segment) {
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
    self._mapRepository = new MapRepository();
    self._mapRepository.SetRenderBody(document.getElementById(containerId));
    self._mapRepository.SetGridProps(sizeX, sizeY, segment);
    $('#state-grid-prop').text(' xsize = ' + sizeX + ' ysize = ' + sizeY + ' segment = ' + segment + ' segmentsize = ' + self._mapRepository.GetGridSegmentSize());
}

function InitializeRenderRepository() {
    self._renderRepository = new RenderRepository();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.set(500, 800, 1300);
    camera.lookAt(0, 0, 0);
    self._renderRepository.SetCamera(camera);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    self._renderRepository.SetScene(scene);

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    self._renderRepository.SetRenderer(renderer);

    self._mapRepository.RenderBody.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    self._renderRepository.SetAmbientLight(ambientLight);

    var orbit = new THREE.OrbitControls(self._renderRepository.Camera, self._renderRepository.Renderer.domElement);
    self._renderRepository.SetOrbitControl(orbit);

    self._renderRepository.SetRayCaster(new THREE.Raycaster());
}

function InitializeAxes(id) {
    var axesHelper = new THREE.AxesHelper(1000);
    axesHelper.name = id;
    self._renderRepository.AddSceneObject(DrawItem.Axes, axesHelper.name, axesHelper, true);
}

function InitializeHandler() {
    document.addEventListener('pointermove', OnMouseMove);
    document.addEventListener('pointerdown', OnMouseDown);
    document.addEventListener('pointerup', OnMouseUp);
    document.addEventListener('keydown', OnKeyDown);
    document.addEventListener('keyup', OnKeyUp);
}

function OnMouseMove(event) {
    self._inputRepository.SetMousePoint(event.clientX, event.clientY);
    self.EventOnMouseMove();
}

function OnMouseDown(event) {
    self._inputRepository.SetMousePoint(event.clientX, event.clientY);
    self._inputRepository.SetMouseClick(event.button, true);
    self.EventOnMouseDown();
}

function OnMouseUp(event) {
    self._inputRepository.SetMousePoint(event.clientX, event.clientY);
    self._inputRepository.SetMouseClick(event.button, true);
    self.EventOnMouseUp();
}

function OnKeyDown(event) {
    self._inputRepository.SetKeyboardValue(event.keyCode, true);
    self.EventOnKeyDown();
}

function OnKeyUp(event) {
    self._inputRepository.SetKeyboardValue(event.keyCode, false);
    self.EventOnKeyUp();
}

function EventOnMouseMoveGlobalRayCast(mousePoint, selectedDrawItem) {
    var rayPoint = new THREE.Vector2();
    rayPoint.set((mousePoint.x / window.innerWidth) * 2 - 1, -(mousePoint.y / window.innerHeight) * 2 + 1);

    var rayObjects = new Array();
    var checkObjectTypes = [DrawItem.Node, DrawItem.Line];
    var checkObjects = self._renderRepository.GetObjectByTypes(checkObjectTypes);

    var cText = $('#crosshair-text-object');
    if (checkObjects == undefined || checkObjects.length < 1) {
        return;
    }
    checkObjects.forEach(function (obj) {
        rayObjects.push(obj);
    });
    var camera = self._renderRepository.Camera;

    var intersects = self._pickRepository.RayCast(rayObjects, rayPoint, camera);
    if (intersects == undefined || intersects.length < 1) {
        for (const [key, obj] of Object.entries(this._pickRepository.PickObjects)) {
            obj.material.color.setHex(obj.currentHex);
        }
        this._pickRepository.Clear();
        cText.text('');
    }

    intersects.forEach(intersected => {
        var key = intersected.object.name;
        var obj = intersected.object;
        var pickObject = self._pickRepository.GetObject(key);
        if (pickObject == undefined) {
            intersected.object.currentHex = intersected.object.material.color.getHex();
            intersected.object.material.color.setHex(__PICK_HEX);
            self._pickRepository.Pick(key, obj);
            if (intersected.object.ObjectType == DrawItem.Line) {
                // intersects.LineDrawAttr
                var firstNodeId = intersected.object.LineDrawAttr.PointIds[PointName.FirstPoint];
                var secondNodeId = intersected.object.LineDrawAttr.PointIds[PointName.SecondPoint];
                var firstNodePos = intersected.object.LineDrawAttr.PointPoses[PointName.FirstPoint];
                var secondNodePos = intersected.object.LineDrawAttr.PointPoses[PointName.SecondPoint];
                var distance = GetDistance(firstNodePos.x, firstNodePos.y, secondNodePos.x, secondNodePos.y);
                cText.text(' node1 = ' + firstNodeId +
                    ' node2 = ' + secondNodeId +
                    ' first X-Y-Z = ' + firstNodePos.x + '-' + firstNodePos.y + '-' + firstNodePos.z +
                    ' second X-Y-Z = ' + secondNodePos.x + '-' + secondNodePos.y + '-' + secondNodePos.z +
                    ' distance ' + distance);

            } else {
                cText.text('x = ' + intersected.object.position.x + ' y = ' + intersected.object.position.y);
            }
        }
    });

    var notIntersects = self._pickRepository.GetExceptObjects(intersects);
    if (notIntersects != undefined) {
        notIntersects.forEach(notIntersected => {
            notIntersected.material.color.setHex(notIntersected.currentHex);
            self._pickRepository.RemovePickOjbect(notIntersected.name);
        });
    }
}

function EventOnMouseMoveCrossHair(mousePoint, selectedDrawItem) {
    var cV = $('#crosshair-v');
    var cH = $('#crosshair-h');
    var cBlock = $('#crosshair-block');
    var cText = $('#crosshair-text-floor');

    cV.css('visibility', 'visible');
    cH.css('visibility', 'visible');
    cBlock.css('visibility', 'visible');

    cV.css('left', mousePoint.x);
    cH.css('top', mousePoint.y);
    cBlock.css('left', mousePoint.x);
    cBlock.css('top', mousePoint.y + 100);

    var rayPoint = new THREE.Vector2();
    rayPoint.set((mousePoint.x / window.innerWidth) * 2 - 1, -(mousePoint.y / window.innerHeight) * 2 + 1);

    var rayObjects = new Array();
    var floorObject = self._renderRepository.GetFloorObject(self._renderRepository.SelectedFloor);
    if (floorObject == undefined) return;
    if (floorObject.length < 1) return;
    floorObject.forEach(function (obj) {
        rayObjects.push(obj);
    });

    var intersects = self._renderRepository.RayCast(rayObjects, rayPoint);
    if (intersects == undefined || intersects.length < 1) return;
    var intersected = intersects[0];

    var calcVector3 = new THREE.Vector3(0, 0, 0);
    calcVector3.copy(intersected.point).add(intersected.face.normal);
    cText.text('x = ' + calcVector3.x + ' y = ' + calcVector3.y);
}

function EventOnMouseMoveWhenExistDrawItem(mousePoint, selectedDrawItem) {
    var rayPoint = new THREE.Vector2();
    rayPoint.set((mousePoint.x / window.innerWidth) * 2 - 1, -(mousePoint.y / window.innerHeight) * 2 + 1);

    var rayObjects = new Array();
    var floorObject = self._renderRepository.GetFloorObject(self._renderRepository.SelectedFloor);
    if (floorObject == undefined) return;
    if (floorObject.length < 1) return;
    var CheckMoreObjects = (selectedDrawItem == DrawItem.Line) ? [] : self._renderRepository.GetObjectByTypes([selectedDrawItem]);
    floorObject.forEach(function (obj) {
        rayObjects.push(obj);
    });
    CheckMoreObjects.forEach(function (obj) {
        rayObjects.push(obj);
    });

    var intersects = self._renderRepository.RayCast(rayObjects, rayPoint);
    if (intersects == undefined || intersects.length < 1) return;
    var intersected = intersects[0];

    var mesh = self._editorRepository.GetMouseOverMesh();
    if (mesh == undefined) return;

    if (selectedDrawItem != DrawItem.Line) {
        var calcVector3 = new THREE.Vector3(0, 0, 0);
        calcVector3.copy(intersected.point).add(intersected.face.normal);
        mesh.position.set(calcVector3.x, calcVector3.y, calcVector3.z);
    } else {
        if (self._editorRepository.HasLineDrawAttrFirstPointPos()) {
            var meshGeo = mesh.geometry;
            var calcVector3 = new THREE.Vector3(0, 0, 0);
            calcVector3.copy(intersected.point);
            self._editorRepository.DrawProperties.SetLineDrawAttrSecondPointPos(intersected.name, calcVector3);

            var linePositions = new Float32Array(__LINE_MAX_POINT * 3);

            var firstPointPos = self._editorRepository.GetLineDrawAttrFirstPointPos();
            var secondPointPos = self._editorRepository.GetLineDrawAttrSecondPointPos();
            linePositions[0] = firstPointPos.x;
            linePositions[1] = firstPointPos.y;
            linePositions[2] = 0;
            linePositions[3] = secondPointPos.x;
            linePositions[4] = secondPointPos.y;
            linePositions[5] = 0;
            meshGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
            mesh.geometry.setDrawRange(0, 2);
            mesh.geometry.attributes.position.needsUpdate = true;
        }
    }
}

function EventOnMouseMove() {
    var mouseMovePoint = self._inputRepository.GetMousePoint();
    var drawSelctedItem = self._editorRepository.GetDrawSelectedItem();
    if (drawSelctedItem != undefined && drawSelctedItem != DrawItem.None) {
        self.EventOnMouseMoveWhenExistDrawItem(mouseMovePoint, self._editorRepository.GetDrawSelectedItem());
    }
    self.EventOnMouseMoveGlobalRayCast(mouseMovePoint, self._editorRepository.GetDrawSelectedItem());
    self.EventOnMouseMoveCrossHair(mouseMovePoint, self._editorRepository.GetDrawSelectedItem());
}

function EventOnMouseDown() {}

function EventOnMouseUpWhenCtrlOn(mousePoint) {
    var rayPoint = new THREE.Vector2();
    rayPoint.set((mousePoint.x / window.innerWidth) * 2 - 1, -(mousePoint.y / window.innerHeight) * 2 + 1);
    if (self._editorRepository.DrawProperties.DrawSelectedItem != DrawItem.None) {
        self.EventOnMouseUpWhenCtrlOnAndHasSelectedDrawItem(rayPoint, self._editorRepository.DrawProperties.DrawSelectedItem);
    }
}

function EventOnMouseUpWhenCtrlOnAndHasSelectedDrawItem(rayPoint, selectedDrawItem) {
    var rayObjects = new Array();
    var floorObject = self._renderRepository.GetFloorObject(self._renderRepository.SelectedFloor);
    if (floorObject == undefined) return;
    if (floorObject.length < 1) return;
    var CheckMoreObjects = (selectedDrawItem == DrawItem.Line) ? self._renderRepository.GetObjectByTypes([DrawItem.Node]) : self._renderRepository.GetObjectByTypes([selectedDrawItem]);
    var CheckExceptObjects = (selectedDrawItem == DrawItem.Line) ? floorObject : [];
    floorObject.forEach(function (obj) {
        rayObjects.push(obj);
    });
    CheckMoreObjects.forEach(function (obj) {
        rayObjects.push(obj);
    });
    CheckExceptObjects.forEach(function (obj) {
        rayObjects = rayObjects.filter(x => x.name != obj.name);
    });

    var intersects = self._renderRepository.RayCast(rayObjects, rayPoint);
    if (intersects == undefined || intersects.length < 1) return;
    var intersected = intersects[0];

    var drawMesh = self._editorRepository.GetMouseOverMesh();
    if (drawMesh == undefined) return;
    var drawScale = self._editorRepository.GetDrawSize(self._editorRepository.DrawProperties.DrawSelectedItem);


    if (selectedDrawItem != DrawItem.Line) {
        var id = self.uuidv4();
        var cloneMesh = drawMesh.clone();
        var cloneGeo = cloneMesh.geometry.clone();
        var cloneMat = cloneMesh.material.clone();
        var clone = new THREE.Mesh(cloneGeo, cloneMat);
        clone.position.copy(intersected.point).add(intersected.face.normal);
        clone.scale.set(drawScale, drawScale, drawScale);
        clone.name = id;
        self._renderRepository.AddSceneObject(selectedDrawItem, id, clone, true);
    } else {
        if (self._editorRepository.HasLineDrawAttrFirstPointPos() == false) {
            var calcVector3 = new THREE.Vector3(intersected.object.position.x, intersected.object.position.y, intersected.object.position.z);
            //calcVector3.copy(intersected.point).add(intersected.face.normal);
            self._editorRepository.DrawProperties.SetLineDrawAttrFirstPointPos(intersected.object.name, calcVector3);
        } else {
            //line
            var calcVector3 = new THREE.Vector3(intersected.object.position.x, intersected.object.position.y, intersected.object.position.z);
            self._editorRepository.DrawProperties.SetLineDrawAttrSecondPointPos(intersected.object.name, calcVector3);

            var id = self.uuidv4();
            var cloneMesh = drawMesh.clone();
            var cloneGeo = cloneMesh.geometry.clone();
            var cloneMat = cloneMesh.material.clone();

            var firstPointPos = self._editorRepository.GetLineDrawAttrFirstPointPos();
            var secondPointPos = self._editorRepository.GetLineDrawAttrSecondPointPos();
            var linePositions = new Float32Array(__LINE_MAX_POINT * 3);
            linePositions[0] = firstPointPos.x;
            linePositions[1] = firstPointPos.y;
            linePositions[2] = 1;
            linePositions[3] = secondPointPos.x;
            linePositions[4] = secondPointPos.y;
            linePositions[5] = 1;

            var clone = new THREE.Line(cloneGeo, cloneMat);
            clone.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            clone.geometry.setDrawRange(0, 2);
            clone.geometry.attributes.position.needsUpdate = true;
            //clone.geometry.computeBoundingBox();
            clone.geometry.computeBoundingSphere();
            clone.name = id;
            clone.LineDrawAttr = structuredClone(self._editorRepository.DrawProperties.LineDrawAttr);
            self._renderRepository.AddSceneObject(selectedDrawItem, id, clone, true);
            self._editorRepository.ClearLineDrawAttr();
            self._editorRepository.ClearRollOverMesh();

        }
    }
}

function EventOnMouseUp() {
    var mouseUpPoint = self._inputRepository.GetMousePoint();
    if (self._inputRepository.IsCtrlOn()) {
        self.EventOnMouseUpWhenCtrlOn(mouseUpPoint);
    }
}

function EventOnKeyDown() {}

function EventOnKeyUp() {}


//animate
function StartAnimate() {
    self._deltaRepository.StartAnim();
    self.Animate();
}

function Animate() {
    self._deltaRepository.AnimateProperties.Now = Date.now();
    self._deltaRepository.AnimateProperties.Elapsed = self._deltaRepository.AnimateProperties.Now - self._deltaRepository.AnimateProperties.Then;
    if (self._deltaRepository.AnimateProperties.Elapsed > self._deltaRepository.AnimateProperties.FpsInterval) {
        self._deltaRepository.AnimateProperties.Then = self._deltaRepository.AnimateProperties.Now - (self._deltaRepository.AnimateProperties.Elapsed % self._deltaRepository.AnimateProperties.FpsInterval);

        //render
        self._renderRepository.Render();
    }
    if (self._deltaRepository.AnimateProperties.Stop == false) {
        requestAnimationFrame(Animate);
    }
}

function StopAnimate() {
    self._deltaRepository.StopAnim();
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
