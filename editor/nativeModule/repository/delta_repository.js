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