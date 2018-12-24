function Enemy() {
    this.runningCycle = 0;

    // Create a mesh that will hold the body.
    this.body = new THREE.Object3D();
    this.name = 'enemy';
    this.rotate = false;
    this.translate = 0;
    this.clock = new THREE.Clock(false);
    this.speed = 0.1;


    this.torso = new THREE.Mesh(new THREE.SphereGeometry(5,16,16, Math.PI/2, Math.PI*2, 0, Math.PI),
        new THREE.MeshLambertMaterial({color: 0x8e6844}));

    this.armatureMaterial = new THREE.MeshLambertMaterial({color: 0x070604});
    this.frontLeft = new THREE.Mesh(new THREE.TorusGeometry(2,1,8,8,Math.PI),
        this.armatureMaterial);
    this.frontLeft.translateX(-5);
    this.frontLeft.translateZ(-2);
    this.frontLeft.rotateY(-10);
    this.frontLeftAngle = 0;
    this.torso.add(this.frontLeft);

    this.frontRight = new THREE.Mesh(new THREE.TorusGeometry(2,1,8,8,Math.PI),
        this.armatureMaterial);
    this.frontRight.translateX(5);
    this.frontRight.translateZ(-2);
    this.frontRight.rotateY(10);
    this.frontRightAngle = 0;
    this.torso.add(this.frontRight);

    this.backLeft = new THREE.Mesh(new THREE.TorusGeometry(2,1,8,8,Math.PI),
        this.armatureMaterial);
    this.backLeft.translateX(-5);
    this.backLeft.translateZ(2);
    this.backLeft.rotateY(10);
    this.backLeftAngle = 0;
    this.torso.add(this.backLeft);

    this.backRight = new THREE.Mesh(new THREE.TorusGeometry(2,1,8,8,Math.PI),
        this.armatureMaterial);
    this.backRight.translateX(5);
    this.backRight.translateZ(2);
    this.backRight.rotateY(-10);
    this.backRightAngle = 0;
    this.torso.add(this.backRight);

    this.body.add(this.torso);

    this.body.name = 'enemyBody';

    this.rotateAboutPoint= function(obj, point, axis, theta, pointIsWorld){
        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }

    // Ensure that every part of the body casts and receives shadows.
    this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    this.moveForward = function(angle){
        this.clock.start();
        this.rotateAboutPoint(this.frontLeft, new THREE.Vector3(0,0,1), new THREE.Vector3(0,1,0),  Math.sin(this.frontLeftAngle /2) / 10 );
        this.frontLeftAngle++;
        this.rotateAboutPoint(this.frontRight, new THREE.Vector3(0,0,-1), new THREE.Vector3(0,1,0), -Math.sin(this.frontRightAngle /2) / 10);
        this.frontRightAngle++;
        this.rotateAboutPoint(this.backLeft, new THREE.Vector3(0,0,1), new THREE.Vector3(0,1,0), -Math.sin(this.backLeftAngle /2 ) /10);
        this.backLeftAngle++;
        this.rotateAboutPoint(this.backRight, new THREE.Vector3(0,0,-1), new THREE.Vector3(0,1,0), Math.sin(this.backRightAngle /2) / 10);
        this.backRightAngle++;
        if ((Math.sign(Math.random() - 0.5) == -1) && this.clock.getDelta() > 10){
            this.rotate = true;
        }
        else {
            this.rotate = false;
        }
        if (this.body.position.x < -5000 && this.body.position.x > 5000 && this.body.position.z < -5000 && this.body.position.z > 5000) {
            this.translate = 0;
        }
        else {
            this.translate = 1;
        }

        if (this.rotate = true){
            this.body.rotateY((Math.random() - 0.5) / Math.PI);
        }
        if (this.translate == 1){
            let deltaX = this.speed * Math.sin(this.body.rotation.x);
            let deltaZ = this.speed * Math.cos(this.body.rotation.z);

            this.body.translateX(deltaX);
            this.body.translateZ(deltaZ);
        }


        //this.frontLeft.rotateY(angle);

    }
    //scene.add(this.body);
}