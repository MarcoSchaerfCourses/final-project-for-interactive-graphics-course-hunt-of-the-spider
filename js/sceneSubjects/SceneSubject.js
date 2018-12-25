function SceneSubject(scene, camera) {

    var mixer = null;
    var actions = {};
    var currentlyPressedKeys = {};
    var modelMixers = [];
    var animationName = ['normal', 'walk_ani_back', 'walk_ani_vor', 'walk_left', 'walk_right', 'warte_pose', 'run_ani_vor', 'run_ani_back', 'run_left','run_right'];
    var activeActionName = 'warte_pose';
    var actualAnimation = 0;
    var threeAdded = false;
    var collidableMeshList = [];
    var enemies = [];
    var box;
    var score = 0;
    var scoreBox = document.getElementById("score");
    var quaternion = new THREE.Quaternion();

    var rayCaster = new THREE.Raycaster();


    function getExtantion(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    function arrayRemove(arr, value) {

        return arr.filter(function(ele){
            return ele != value;
        });

    }

    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
            }

            if (timer == duration && score < 20){
                alert("game over")
            }
        }, 1000);
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

        actions = initilizeAction(clips);
        actions = setEffectiveWeight(actions);
        actions = enableAllAction(actions);

        collidableMeshList.push(model);
        scene.add(model);
        modelMixers.push({model, mixer});
    }

    function loadModelFbx(fbx, position) {
        //fbx.remove(fbx.getObjectByName('Hemi'));
        fbx.name="spider";
        fbx.castShadow = true;
        fbx.receiveShadow = true;
        fbx.position.set(position.x, position.y, position.z);
        fbx.scale.set(0.1,0.1,0.1);
        // model is a THREE.Group (THREE.Object3D)
        mixer = new THREE.AnimationMixer(fbx);
        // animations is a list of THREE.AnimationClip
        actions = initilizeAction(fbx.animations);
        actions = setEffectiveWeight(actions);
        actions = enableAllAction(actions);
        actions.warte_pose.play();
        //fbx.add(camera);
        fbx.boundingBox = new THREE.Box3().setFromObject(fbx);
        box = new THREE.BoxHelper( fbx, 0xffff00 );
        scene.add( box );
        collidableMeshList.push(fbx);
        scene.add(fbx);
        modelMixers.push({fbx, mixer});
    }

    function placeOnTerrain(object) {
        // Add copies of the tree model to the world, with various sizes and positions.
        rayCaster.set(object.position.setY(5000), new THREE.Vector3(0, -1, 0));

        var intersects = rayCaster.intersectObject(t.meshGround);
        if (intersects.length > 0) {
            //modelMixers[0].fbx.position.set(0,0,0);
            //modelMixers[0].fbx.lookAt(intersects[0].face.normal);
            //modelMixers[0].fbx.rotateX(-Math.PI / 2);
            object.position.setY(intersects[0].point.y);
        }

    }

    function randomPlaceOnTerrainTree(width,height, numOfInstance, object) {
        for (var i = 0; i<numOfInstance; i++ ){
            var instance = object.clone();
            instance.position.x = (Math.random() - 0.5) * width;
            instance.position.z = (Math.random() - 0.5) * height;
            collidableMeshList.push(instance.getObjectByName('trunk'));
            placeOnTerrain(instance);
            scene.add(instance);
        }
    }

    function randomPlaceOnTerrainEnemy(width,height, numOfInstance) {
        for (var i = 0; i<numOfInstance; i++ ){
            const enemy = new Enemy();
            enemy.body.position.x = (Math.random() - 0.5) * width;
            enemy.body.position.z = (Math.random() - 0.5) * height;
            enemy.body.scale.set(0.5,0.5,0.5);
            enemy.body.translateY(1);
            enemy.boundingBox =  new THREE.Box3().setFromObject(enemy.body);
            enemy.boxHelper = new THREE.BoxHelper( enemy.body, 0xffff00 );


            console.log('Enemy created');
            placeOnTerrain(enemy.body);
            scene.add(enemy.body);
            scene.add(enemy.boxHelper);
            enemies.push(enemy);
        }
    }

    function addTree() {
        var textureObject = new THREE.TextureLoader();
        textureObject.load('images/textures/tree.jpeg');
        textureObject.wrapS = THREE.RepeatWrapping;
        textureObject.wrapT = THREE.RepeatWrapping;
        var tree = new THREE.Object3D();
        var trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2,0.2,1,16,1),
            new THREE.MeshLambertMaterial({
                color: 0x885522
            })
        );
        trunk.position.y = 0.5;  // move base up to origin

        var leaves = new THREE.Mesh(
            new THREE.ConeGeometry(.7,2,16,3),
            new THREE.MeshPhongMaterial({
                color: 0x00BB00,
                specular: 0x002000,
                shininess: 5
            })
        );
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        trunk.name = 'trunk'
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        leaves.name = 'leaves'
        leaves.position.y = 2;  // move bottom of cone to top of trunk
        tree.add(trunk);
        tree.add(leaves);
        tree.name = 'tree';

        tree.scale.set(30,30,30);

        randomPlaceOnTerrainTree(2500,2500, 100, tree);


    }

    var t = new Terrain(scene, 2500, 2500, 0.001);
    t.updateTerrain(t.width,t.height,t.segments,t.smoothingFactor);


    //t.combinedGround.computeFaceNormals();
    //t.combinedGround.computeVertexNormals();

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

    function createEnemy() {
        //placeOnTerrain(enemy.body);
        randomPlaceOnTerrainEnemy(1000,1000, 50);
        //enemy.body.translateY(2);
    }


    var xSpeed = 0.3;
    var zSpeed = 0.3;
    var runSpeed = 2;
    var runRotSpeed = 2;

    const time = new THREE.Clock();

    this.update = function() {
        if (actions.warte_pose){

            const spider = scene.getObjectByName("spider");

            var originPoint = spider.position.clone();

            var collidedFront = false;
            var collidedBack = false;

            var localCenter = new THREE.Vector3();
            localCenter.x = (spider.boundingBox.max.x + spider.boundingBox.min.x) / 2;
            localCenter.y = (spider.boundingBox.max.y + spider.boundingBox.min.y) / 2;
            localCenter.z = (spider.boundingBox.max.z + spider.boundingBox.min.z) / 2;

            var globalVertex = localCenter.applyMatrix4( spider.matrix );
            var directionVector = globalVertex.sub( spider.position );
            var rayFront = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            var collisionResultsFront = rayFront.intersectObjects( collidableMeshList );
            if ( collisionResultsFront.length > 0 && collisionResultsFront[0].distance - localCenter.z < 20 )
                collidedFront = true;
            var rayBack = new THREE.Raycaster(originPoint, directionVector.clone().negate().normalize());
            var collisionResultsBack = rayBack.intersectObjects(collidableMeshList);
            if (collisionResultsBack.length > 0 && collisionResultsBack[0].distance - localCenter.z < 20)
                collidedBack = true;

            /*var globalCenter = localCenter.applyMatrix4( spider.matrix );
            var direction = new THREE.Vector3(0,0,-1).applyQuaternion(spider.quaternion);

            var ray = new THREE.Raycaster( originPoint, direction.normalize() );
            var collisionResults = ray.intersectObjects( collidableMeshList );
            if ( collisionResults.length > 0 && collisionResults[0].distance < localCenter.z + 1 )
                collided = true;*/

            /*if (collisionResults.length > 0){
                alert("Hülooo");
            }*/

            // Pressed On 'W'
            if (currentlyPressedKeys[87] == true && currentlyPressedKeys[16] != true) {
                if (actualAnimation != 2){
                    actualAnimation = 2;
                    fadeAction(animationName[actualAnimation], actions);
                }
                if (collidedFront == false){
                    let deltaX = -xSpeed * Math.sin(spider.rotation.x);
                    let deltaZ = -zSpeed * Math.cos(spider.rotation.z);

                    //spider.position.z -= ySpeed;

                    spider.translateX(deltaX);
                    spider.translateZ(deltaZ);
                }
            }
            //Pressed on 'S'
            if (currentlyPressedKeys[83] == true && currentlyPressedKeys[16] != true) {
                if (actualAnimation != 1){
                    actualAnimation = 1;
                    fadeAction(animationName[actualAnimation], actions);
                }
                if (collidedBack == false){
                    let deltaX = xSpeed * Math.sin(spider.rotation.x);
                    let deltaZ = zSpeed * Math.cos(spider.rotation.z);

                    spider.translateX(deltaX);
                    spider.translateZ(deltaZ);
                    //spider.position.z += ySpeed;
                }
            }
            //Pressed on 'A'
            if (currentlyPressedKeys[65] == true && currentlyPressedKeys[16] != true) {
                if (actualAnimation !=3){
                    actualAnimation = 3;
                    fadeAction(animationName[actualAnimation], actions);
                }
                spider.rotation.y += 0.02;

            }
            //Pressed on 'D'
            if (currentlyPressedKeys[68] == true && currentlyPressedKeys[16] != true) {
                if (actualAnimation != 4){
                    actualAnimation = 4;
                    fadeAction(animationName[actualAnimation], actions);
                }
                spider.rotation.y -= 0.02;
            }
            //Pressed on 'Shift'
            if (currentlyPressedKeys[16] == true) {
                //Pressed on 'W' while 'Shift' pressed
                if (currentlyPressedKeys[87] == true) {
                    if (actualAnimation != 6) {
                        actualAnimation = 6;
                        fadeAction(animationName[actualAnimation], actions);
                    }
                    let deltaX = -runSpeed * xSpeed * Math.sin(spider.rotation.x);
                    let deltaZ = -runSpeed * zSpeed * Math.cos(spider.rotation.z);

                    spider.translateX(deltaX);
                    spider.translateZ(deltaZ);
                }
                //Pressed on 'S' while 'Shift' pressed
                if (currentlyPressedKeys[83] == true){
                    if (actualAnimation != 7) {
                        actualAnimation = 7;
                        fadeAction(animationName[actualAnimation], actions);
                    }
                    let deltaX = runSpeed * xSpeed * Math.sin(spider.rotation.x);
                    let deltaZ = runSpeed * zSpeed * Math.cos(spider.rotation.z);

                    spider.translateX(deltaX);
                    spider.translateZ(deltaZ);

                }
                //Pressed on 'A' while 'Shift' pressed
                if (currentlyPressedKeys[65] == true){
                    if (actualAnimation != 8) {
                        actualAnimation = 8;
                        fadeAction(animationName[actualAnimation], actions);
                    }
                    spider.rotation.y += runRotSpeed * 0.02;
                }

                if (currentlyPressedKeys[68] == true){
                    if (actualAnimation != 9) {
                        actualAnimation = 9;
                        fadeAction(animationName[actualAnimation], actions);
                    }
                    spider.rotation.y -= runRotSpeed * 0.02;
                }
            }
            modelMixers.forEach(({mixer}) => {mixer.update(time.getDelta());});
            /*modelMixers[0].fbx.getWorldPosition(controls.target);

            direction.subVectors( camera.position, controls.target );
            direction.normalize().multiplyScalar( 100 );
            camera.position.copy( direction.add( controls.target ) );*/

            //controls.target= modelMixers[0].fbx.position;

            var relativeCameraOffset = new THREE.Vector3(0,200,400);
            var cameraOffset = relativeCameraOffset.applyMatrix4( spider.matrixWorld );
            camera.position.x = cameraOffset.x;
            camera.position.y = cameraOffset.y;
            camera.position.z = cameraOffset.z;
            camera.lookAt( spider.position );

            if (t.combinedGround){
                if (!threeAdded){
                    addTree();
                    createEnemy();
                    threeAdded = true;
                    var fiveMinutes = 60 * 1,
                        display = document.querySelector('#timer');
                    startTimer(fiveMinutes, display);
                }
                if (enemies.length > 0){
                    enemies.forEach(function (enemy) {
                        enemy.moveForward();
                        enemy.boundingBox.setFromObject(enemy.body);
                        placeOnTerrain(enemy.body);
                        enemy.boxHelper.update();
                    })
                }

                rayCaster.set(modelMixers[0].fbx.position.setY(1000), new THREE.Vector3(0, -1, 0));
                var intersects = rayCaster.intersectObject(t.meshGround);
                if (intersects.length > 0){

                    /*if (spider.up != intersects[0].face.normal){
                        quaternion.setFromUnitVectors(spider.up, intersects[0].face.normal);
                        spider.applyQuaternion(quaternion);
                        spider.up = intersects[0].face.normal;//Z axis up
                        //spider.rotateX(-Math.PI /2);
                    }*/

                    spider.position.setY(intersects[0].point.y);
                }


                /*rayCaster.set(new THREE.Vector3(originPoint.x, spider.boundingBox.min.y, originPoint.z), new THREE.Vector3(0,0,1));
                const enemyBodies = enemies.map(enemy=> enemy.body);
                var intersectsEnemy = rayCaster.intersectObjects(enemyBodies);
                if ( intersectsEnemy.length > 0 && intersectsEnemy[0].distance - localCenter.z < 20 ) {
                    scene.remove(intersectsEnemy[0].object);
                }*/
                var collusion = false;
                enemies.forEach(function (enemy) {
                    if (spider.boundingBox.intersectsBox(enemy.boundingBox)) {
                        collusion = true;
                        enemies = arrayRemove(enemies, enemy);
                        scene.remove(enemy.body);
                        score += 1;
                        //spider.scale.set(score/20,score/20,score/20);
                    }
                })
                box.update();
                spider.boundingBox.setFromObject(spider);
                scoreBox.innerHTML = "Score: " + score;
            }

        }
    }

    this.onKeyRelease = function(keyCode) {
        currentlyPressedKeys[keyCode] = false;
        fadeAction(animationName[5], actions);
        actualAnimation = 5;
    }

    this.onKeyDown = function(keyCode) {
        currentlyPressedKeys[keyCode] = true;
    }
}