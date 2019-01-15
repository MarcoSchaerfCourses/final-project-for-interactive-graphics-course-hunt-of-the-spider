function GeneralLights(scene) {

	var al = new THREE.AmbientLight("#ffffff", 0.3333); // soft white light
    scene.add( al );

	var pl = new THREE.PointLight( 0xffffff, 1 );
    pl.position.set( 0, 1000, 0 );
    pl.castShadow = true;            // default false
    scene.add( pl );

// Set up shadow properties for the light
    pl.shadow.mapSize.width = 1000;  // default
    pl.shadow.mapSize.height = 1000; // default
    pl.shadow.camera.near = -500;       // default
    pl.shadow.camera.far = 500      // default
	pl.position.set(20,50,20);
    pl.shadowDarkness = 0.5;
    pl.shadowCameraVisible = true;

    // var dl = new THREE.DirectionalLight("#ffffff", 0.9);
    // dl.position.set( 0, 1, 0 ); 			//default; light shining from top
    // dl.castShadow = true;
    // dl.shadowDarkness = 0.5;
    // dl.shadowCameraVisible = true;
    // dl.shadow.mapSize.width = 1000;  // default
    // dl.shadow.mapSize.height = 1000; // default
    // dl.shadow.camera.near = -500;       // default
    // dl.shadow.camera.far = 1000      // default
	// scene.add(dl);

	// var hl = new THREE.HemisphereLight(0xC0C0C0, 0x826F26);
    // hl.castShadow = true;
    // scene.add(hl);

    //Create a helper for the shadow camera (optional)
    // var helper = new THREE.CameraHelper( pl.shadow.camera );
    // scene.add( helper );

	this.update = function(time) {
		//dl.intensity = (Math.sin(time)+1.5)/1.5;
		//dl.color.setHSL( Math.sin(time), 0.5, 0.5 );
	}
}