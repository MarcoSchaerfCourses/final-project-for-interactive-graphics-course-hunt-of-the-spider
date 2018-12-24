function SceneManager(canvas) {

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    var scene = buildScene();
    var renderer = buildRender(screenDimensions);
    var camera = buildCamera(screenDimensions);
    //var controls = createController(camera, renderer);
    var controls = null;
    var sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        var scene = new THREE.Scene();
        scene.background = "#000"

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

        renderer.autoClear = false;
        //renderer.setClearColor(0x00ff00);
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 70;
        const nearPlane = 0.5;
        const farPlane = 20000;
        var camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(0,50,50);
        //camera.position.set(0, 5, 3);
        //camera.lookAt(new THREE.Vector3(0,0,0));

        return camera;
    }
    
    function createController(camera, renderer) {
        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minDistance = 100;
        controls.maxDistance = 1500;
        controls.maxPolarAngle = Math.PI / 2;

        return controls;
    }

    function createSceneSubjects(scene) {
        var sceneSubjects = [
            new GeneralLights(scene),
            new SceneSubject(scene, camera, controls)
        ];

        return sceneSubjects;
    }
    this.onDocumentKeyUp = function (keyCode) {
        sceneSubjects[1].onKeyRelease(keyCode);
    }
    this.onDocumentKeyDown = function (keyCode) {
        const time = new THREE.Clock();
        sceneSubjects[1].onKeyDown(keyCode, time);
    }


    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;
        camera.aspect = screenDimensions.width / screenDimensions.height;
        camera.updateProjectionMatrix();
        //camera = buildCamera(width, height)

        renderer.setSize(width, height);

        //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    this.update = function() {

        for(let i=0; i<sceneSubjects.length; i++){
            sceneSubjects[i].update();
            //this.onWindowResize();
        }

        //controls.update();
        renderer.clear();
        renderer.render(scene, camera);
    }


}