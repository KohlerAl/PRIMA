namespace Script {

    export function setUpCam(): void {
        camNode = new ƒ.Node("camNode");
        camNode.addComponent(createCamera());
        camNode.addComponent(new ƒ.ComponentTransform());
        camNode.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));

        let marioParent: ƒ.Node = graph.getChildrenByName("Avatar")[0];
        marioParent.addChild(camNode);
    }

    function createCamera(): ƒ.ComponentCamera {
        let newCam: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        //newCam.projectOrthographic(); 
        viewport.camera = newCam;
        viewport.camera.projectCentral(canvas.clientWidth / canvas.clientHeight, 5);
        //viewport.camera.mtxPivot.translate(new ƒ.Vector3(0, 0, 0));
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateZ(-450);

        viewport.camera.mtxPivot.scale(new ƒ.Vector3(2, 1, 2));

        return newCam;
    }

    export function moveCam(_vector: ƒ.Vector3): void {
        _vector.transform(camNode.mtxLocal, false);
        _vector.scale(1 / 45);
        camNode.mtxLocal.translate(_vector);
    }
}