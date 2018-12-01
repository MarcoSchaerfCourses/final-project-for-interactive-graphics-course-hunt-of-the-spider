const canvas = document.getElementById("canvas");
//document.getElementById("animate").disable = false;

const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners() {
	window.onresize = resizeCanvas;
    document.onkeyup = documentKeyUp;
    document.onkeydown = documentKeyDown;
	resizeCanvas();
	//window.onkeydown = documentKeyDown;
	//documentKeyDown(window.onkeydown)
	//document.addEventListener("keydown", documentKeyDown, false);
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';
	
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
    
    sceneManager.onWindowResize();
}

function documentKeyUp(event) {
    var keyCode = event.which;
    sceneManager.onDocumentKeyUp(keyCode);
}

function documentKeyDown(event) {
    var keyCode = event.which;
    sceneManager.onDocumentKeyDown(keyCode);
};

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}