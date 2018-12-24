function GeneralLights(scene) {

	var al = new THREE.AmbientLight("#0000ff", 0.3333); // soft white light
    scene.add( al );

	var pl = new THREE.PointLight("#2222ff");
	pl.position.set(20,50,20);
	pl.castShadow = true;
    scene.add(pl);

    var dl = new THREE.DirectionalLight("#ffffff", 0.2);
    dl.position.set( 0, 1, 0 ); 			//default; light shining from top
    dl.castShadow = true;
    dl.shadow.mapSize.width = 512;  // default
    dl.shadow.mapSize.height = 512; // default
    dl.shadow.camera.near = 0.5;       // default
    dl.shadow.camera.far = 500      // default
	scene.add(dl);

	var hl = new THREE.HemisphereLight(0xC0C0C0, 0x826F26);
	scene.add(hl);

    //Create a helper for the shadow camera (optional)
    var helper = new THREE.CameraHelper( dl.shadow.camera );
    scene.add( helper );

	this.update = function(time) {
		//dl.intensity = (Math.sin(time)+1.5)/1.5;
		//dl.color.setHSL( Math.sin(time), 0.5, 0.5 );
	}
}