const KeyBoardCode = {
    Shift: 16,
    Ctrl: 17
};
Object.freeze(KeyBoardCode);

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
