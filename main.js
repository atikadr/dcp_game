var cocos2dApp = cc.Application.extend({
	config:document.ccConfig,
	ctor:function (scene) {
		this._super();
		this.startScene = scene;
		cc.COCOS2D_DEBUG = this.config["COCOS2D_DEBUG"];
        	cc.initDebugSetting();
		cc.setup(this.config["tag"]);
		cc.Loader.getInstance().onloading = function () {
			//cc.LoaderScene.shareLoaderScene().draw();
		};
		cc.Loader.getInstance().onload = function () {
			cc.AppController.shareAppController().didFinishLaunchingWithOptions();
		};
		cc.Loader.getInstance().preload([
			{type:"image",src:"../images/singlePlayer.png"},
			{type:"image",src:"../images/multiplayer.png"},
			{type:"image",src:"../images/jamSession.png"},
			{type:"image",src:"../images/settings.png"},
			{type:"image",src:"../images/instructions.png"},
			{type:"image",src:"../images/dot.png"},
			{type:"image",src:"../images/note.png"},
			{type:"image",src:"../images/whitebox.png"},
			{type:"image",src:"../images/beat.png"},
			{type:"image",src:"../images/animation.png"},
			{type:"image",src:"../images/play.png"}
		]);
	},
	applicationDidFinishLaunching:function () {
		var director = cc.Director.getInstance();
		director.setDisplayStats(this.config["showFPS"]);
		director.setAnimationInterval(1.0 / this.config["frameRate"]);
		director.runWithScene(new this.startScene());
		return true;
	}
});     
var myApp = new cocos2dApp(gamescene);