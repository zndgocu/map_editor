const CrossHairLine = {
    Vertical: 1,
    Horizontal : 2
}

class CrossHair{
    constructor(){
        this.Hairs = {};
        this.Hairs[CrossHairLine.Vertical] = undefined;
        this.Hairs[CrossHairLine.Horizontal] = undefined;

        this.HtmlElements = {};
    }
    //#region crosshair visible
    SetVisibleHairVertical(visible){
        this.SetVisibleHair(CrossHairLine.Vertical, visible);
    }
    SetVisibleHairHorizontal(visible){
        this.SetVisibleHair(CrossHairLine.Horizontal, visible);
    }
    SetVisibleHair(crossHairLine, visible){
        if(this.Hairs[crossHairLine] != undefined){
            if(visible == true){
                this.Hairs[crossHairLine].css('visibility', 'visible');
            }else{
                this.Hairs[crossHairLine].css('visibility', 'hidden');
            }
        }
    }
    SetVisibleHairs(visible){
        this.SetVisibleHairVertical(visible);
        this.SetVisibleHairHorizontal(visible);
    }
    //#endregion
 
    //#region crosshair left right
    SetLeftHairVertical(left){
        this.SetLeftHair(CrossHairLine.Vertical, left);
    }
    SetTopHairVertical(top){
        this.SetTopHair(CrossHairLine.Vertical, top);
    }
    SetLeftHairHorizontal(left){
        this.SetLeftHair(CrossHairLine.Horizontal, left);
    }
    SetTopHairHorizontal(top){
        this.SetTopHair(CrossHairLine.Horizontal, top);
    }
    SetLeftHair(crossHairLine, left){
        if(this.Hairs[crossHairLine] != undefined){
            this.Hairs[crossHairLine].css('left', left);
        }
    }
    SetTopHair(crossHairLine, top){
        if(this.Hairs[crossHairLine] != undefined){
            this.Hairs[crossHairLine].css('top', top);
        }
    }
    //#endregion

    
    AddHairElement(crossHairLine, htmlElement){
        if(this.Hairs[crossHairLine] == undefined){
            this.Hairs[crossHairLine] = htmlElement;
        }
    }
    AddHtmlElement(id, htmlElement){
        if(this.HtmlElements[id] == undefined){
            this.HtmlElements[id] = htmlElement;
        }
    }
    SetTextHtmlElement(id, text){
        if(this.HtmlElements[id] != undefined){
            this.HtmlElements[id].text(text);
        }
    }
    SetLeftHtmlElement(id, left){
        if(this.HtmlElements[id] != undefined){
            this.HtmlElements[id].css('left', left);
        }
    }
    SetTopHtmlElement(id, top){
        if(this.HtmlElements[id] != undefined){
            this.HtmlElements[id].css('top', top);
        }
    }
}