class AnimateProperties {
    construct() {
        this.Stop = true;
        this.FrameCount = 0;
        this.Fps = 0;
        this.FpsInterval = 0;
        this.StartTime = 0;
        this.Now = 0;
        this.Then = 0;
        this.Elapsed = 0;
    }
    Start() {
        this.Then = Date.now();
        this.Fps = 60;
        this.FpsInterval = 1000 / this.Fps;
        this.StartTime = Date.now();
        this.Stop = false;
    }
    Stop(){
        this.Stop = true;
    }
}
