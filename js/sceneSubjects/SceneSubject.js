function SceneSubject(scene, camera, controls) {

    var mixer = null;
    var normal,  walk_ani_back, walk_ani_vor, walk_left,walk_right, warte_pose;
    var actions = {};
    var currentlyPressedKeys = {};
    var modelMixers = [];
    var animationName = ['normal', 'walk_ani_back', 'walk_ani_vor', 'walk_left', 'walk_right', 'warte_pose', 'run_ani_vor', 'run_ani_back', 'run_left','run_right'];
    var activeActionName = 'warte_pose';
    var actualAnimation = 0;
    var playerDirection = 0;

    var rayCaster = new THREE.Raycaster();


    function getExtantion(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    function initilizeAction(clips) {
        actions.normal = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|normal'));
        actions.walk_ani_back = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|walk_ani_back'));
        actions.walk_ani_vor = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|walk_ani_vor'));
        actions.walk_left = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|walk_left'));
        actions.walk_right = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'Spider_Armature|walk_right'));
        actions.warte_pose = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|warte_pose'));
        actions.run_ani_vor = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|run_ani_vor'));
        actions.run_ani_back = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|run_ani_back'));
        actions.run_left = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|run_left'));
        actions.run_right = mixer.clipAction(THREE.AnimationClip.findByName(clips,'Spider_Armature|run_right'));

        return actions;
        //activateAllActions(actions);
    }
    
    function setEffectiveWeight(actions) {
        actions.normal.setEffectiveWeight(1);
        actions.walk_ani_back.setEffectiveWeight(1);
        actions.walk_ani_vor.setEffectiveWeight(1);
        actions.walk_left.setEffectiveWeight(1);
        actions.walk_right.setEffectiveWeight(1);
        actions.warte_pose.setEffectiveWeight(1);
        actions.run_ani_vor.setEffectiveWeight(1);
        actions.run_ani_back.setEffectiveWeight(1);
        actions.run_left.setEffectiveWeight(1);
        actions.run_right.setEffectiveWeight(1);

        return actions;
    }

    function enableAllAction(actions) {
        actions.normal.enable = true;
        actions.walk_ani_back.enable = true;
        actions.walk_ani_vor.enable = true;
        actions.walk_left.enable = true;
        actions.walk_right.enable = true;
        actions.warte_pose.enable = true;
        actions.run_ani_vor.enable = true;
        actions.run_ani_back.enable = true;
        actions.run_left.enable = true;
        actions.run_right.enable = true;

        return actions;
    }

    function fadeAction (name) {
        var from = actions[ activeActionName ].play();
        var to = actions[ name ].play();

        from.enabled = true;
        to.enabled = true;

        if (to.loop === THREE.LoopOnce) {
            to.reset();
        }

        from.crossFadeTo(to, 0.3);
        activeActionName = name;

    }


    function installModel(url, where=null) {
        var extantion = getExtantion(url)[0];
        if (extantion == "glb") {
            function callbackGltf(gltf) {  // callback function to be executed when loading finishes.
                console.log('GLM file loaded successfully.');
                console.info('Load time: ' + (performance.now() - loadStartTime).toFixed(2) + ' ms.');
                var mesh = gltf.scene;
                var clips = gltf.animations;
                if (where === null) {
                    loadModelGlft(mesh, clips, new THREE.Vector3(0, 0, 0));
                } else {
                    loadModelGlft(mesh, clips, where);
                }

            }

            var loader = new THREE.GLTFLoader();
            THREE.DRACOLoader.setDecoderPath('js/libs/draco/gltf/');
            loader.setDRACOLoader(new THREE.DRACOLoader());
            loader.load(url, callbackGltf);
        }
        if (extantion == "fbx") {
            function callbackFbx(fbx) {
                console.log('FBX file loaded successfully. ');
                console.info('Load time: ' + (performance.now() - loadStartTime).toFixed(2) + ' ms.');
                //fbx.name="spider";
                // model is a THREE.Group (THREE.Object3D)
                if (where == null) {
                    loadModelFbx(fbx, new THREE.Vector3(0, 0, 0));
                } else {
                    loadModelFbx(fbx, where);
                }
            }
            var loader = new THREE.FBXLoader();
            loader.load(url, callbackFbx);
            //mixer = new THREE.AnimationMixer(model);
            // animations is a list of THREE.AnimationClip
            //mixer.clipAction(model.animations[0]).play();
            //scene.add(model);
        }
    }

    function loadModelGlft(mesh, clips, position) {
        var object = mesh.clone();

        //object.material = mesh.material.clone();
        object.castShadow = true;
        object.receiveShadow = true;

        var scale = 0.2;

        /* Create the wrapper, model, to scale and rotate the object. */

        var model = new THREE.Object3D();
        model.add(mesh);
        model.scale.set(scale, scale, scale);
        //model.rotation.y = Math.PI/2;
        model.position.set(position.x, position.y, position.z);
        model.castShadow = true;
        model.receiveShadow = true;
        model.name = "spider";

        mixer = new THREE.AnimationMixer(model);

        initilizeAction(clips);
        walk_ani_vor.play();

        scene.add(model);
        modelMixers.push({model, mixer});
    }

    function loadModelFbx(fbx, position) {
        var scale = 0.2;
        //fbx.remove(fbx.getObjectByName('Hemi'));
        fbx.name="spider";
        fbx.castShadow = true;
        fbx.position.set(position.x, position.y, position.z);
        fbx.scale.set(scale,scale,scale);
        // model is a THREE.Group (THREE.Object3D)
        mixer = new THREE.AnimationMixer(fbx);
        // animations is a list of THREE.AnimationClip
        actions = initilizeAction(fbx.animations);
        actions = setEffectiveWeight(actions);
        actions = enableAllAction(actions);
        actions.warte_pose.play();
        fbx.add(camera);
        scene.add(fbx);
        modelMixers.push({fbx, mixer});
    }

    var t = new Terrain(scene);
    t.updateTerrain(t.width,t.height,t.segments,t.smoothingFactor);

    t.combinedGround.computeFaceNormals();
    t.combinedGround.computeVertexNormals();

    var loadStartTime = performance.now();
    installModel('assets/spider/Only_Spider_with_Animations_Export_withoutHemi.fbx');

    var geometry = new THREE.BoxGeometry(10000, 10000, 10000);
    var cubeMaterials =
        [
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_ft.tga"), side: THREE.DoubleSide}
            ),
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_bk.tga"), side: THREE.DoubleSide}
            ),
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_up.tga"), side: THREE.DoubleSide}
            ),
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_dn.tga"), side: THREE.DoubleSide}
            ),
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_rt.tga"), side: THREE.DoubleSide}
            ),
            new THREE.MeshBasicMaterial({map: new THREE.TGALoader().load("images/skybox/hills_lf.tga"), side: THREE.DoubleSide}
            )
        ];

    var skybox = new THREE.Mesh(geometry, cubeMaterials);
    scene.add(skybox);


    var planeGeo = new THREE.PlaneGeometry(10000,10000);
    var floorMesh = new THREE.Mesh(planeGeo,
        new THREE.MeshPhongMaterial( { color: "#00FF00"} ));
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x -= Math.PI / 2;
    //scene.add(floorMesh);



    var xSpeed = 0.2;
    var zSpeed = 0.2;

    const time = new THREE.Clock();

    this.update = function(controls) {
        if (actions.warte_pose){

            ball = scene.getObjectByName("spider");

            if (currentlyPressedKeys[87] == true) {
                if (actualAnimation != 2){
                    actualAnimation = 2;
                    fadeAction(animationName[actualAnimation], actions);
                }
                let deltaX = -xSpeed * Math.sin(ball.rotation.x);
                let deltaZ = -zSpeed * Math.cos(ball.rotation.z);

                //ball.position.z -= ySpeed;

                ball.translateX(deltaX);
                ball.translateZ(deltaZ);

            } if (currentlyPressedKeys[83] == true) {
                if (actualAnimation != 1){
                    actualAnimation = 1;
                    fadeAction(animationName[actualAnimation], actions);
                }
                let deltaX = xSpeed * Math.sin(ball.rotation.x);
                let deltaZ = zSpeed * Math.cos(ball.rotation.z);

                ball.translateX(deltaX);
                ball.translateZ(deltaZ);
                //ball.position.z += ySpeed;
            } if (currentlyPressedKeys[65] == true) {
                if (actualAnimation !=3){
                    actualAnimation = 3;
                    fadeAction(animationName[actualAnimation], actions);
                }
                ball.rotation.y += 0.02;

            } if (currentlyPressedKeys[68] == true) {
                if (actualAnimation != 4){
                    actualAnimation = 4;
                    fadeAction(animationName[actualAnimation], actions);
                }
                ball.rotation.y -= 0.02;
            } if (currentlyPressedKeys[16] == true) {

            }
            modelMixers.forEach(({mixer}) => {mixer.update(time.getDelta());});
            controls.target = modelMixers[0].fbx.position;
            if (t.combinedGround){
                rayCaster.set(modelMixers[0].fbx.position.setY(5000), new THREE.Vector3(0, -1, 0));
                var intersects = rayCaster.intersectObject(t.meshGround);
                if (intersects.length > 0){
                    //modelMixers[0].fbx.position.set(0,0,0);
                    //modelMixers[0].fbx.lookAt(intersects[0].face.normal);
                    //modelMixers[0].fbx.rotateX(-Math.PI / 2);
                    modelMixers[0].fbx.position.setY(intersects[0].point.y);
                }
            }

        }
    }

    this.activateAction = function(keyCode) {
        currentlyPressedKeys[keyCode] = false;
        fadeAction(animationName[5], actions);
        actualAnimation = 5;
    }

    this.moveBall = function(keyCode) {

        currentlyPressedKeys[keyCode] = true;
        /*
        //currentlyPressedKeys[keyCode] = true;
        ball = scene.getObjectByName("spider");
        /!*for (var _j = 0; _j < mixers.length; _j++) {
            mixers[_j].update(time.getDelta());
        }*!/
        //lastTime = time;
        //modelMixers.forEach(({mixer}) => {mixer.update(time.getDelta());});
        if (keyCode == 87) {
            actualAnimation = 2;
            if (!currentlyPressedKeys[87]) {
                fadeAction(animationName[actualAnimation], actions);
                currentlyPressedKeys[87] = true;
            }
            ball.position.z -= ySpeed;
            //ball.rotateX(Math.PI / ySpeed)
        } if (keyCode == 83) {
            actualAnimation = 1;
            if (!currentlyPressedKeys[83]) {
                fadeAction(animationName[actualAnimation], actions);
                currentlyPressedKeys[83] = true;
            }            //ball.rotateX(-Math.PI / ySpeed)
            ball.position.z += ySpeed;
        } if (keyCode == 65) {
            actualAnimation = 3;
            //ball.position.x -= xSpeed;
            if (!currentlyPressedKeys[65]) {
                fadeAction(animationName[actualAnimation], actions);
                currentlyPressedKeys[65] = true;
            }            //ball.rotateZ(Math.PI / xSpeed)
            ball.rotation.y += 0.1;

        } if (keyCode == 68) {
            actualAnimation = 4;
            //ball.position.x += xSpeed;
            //ball.rotateY(xSpeed);
            if (!currentlyPressedKeys[68]) {
                fadeAction(animationName[actualAnimation], actions);
                currentlyPressedKeys[68] = true;
            }            //ball.rotateZ(-Math.PI / xSpeed)
            ball.rotation.y -= 0.1;
        } else if (keyCode == 32) {
            ball.position.set(0, radius, 0);
        }*/
    }
}