const MouseButton = {
    Left: 0,
    Middle: 1,
    Right: 2    
}

Object.freeze(MouseButton);

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
