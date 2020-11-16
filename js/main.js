var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", 
    BABYLON.Tools.ToRadians(0), 
    BABYLON.Tools.ToRadians(0), 
    50, 
    new BABYLON.Vector3(0,0,0), scene);

    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(0, 0, 0);
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;

    //camera.attachControl(canvas, true);

    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.5}, scene);
    var tiledBox = BABYLON.MeshBuilder.CreateTiledBox("box", {size:1, tileSize:1, depth: 10}, scene);
    var tiledBox2 = BABYLON.MeshBuilder.CreateTiledBox("box2", {size:1, tileSize:1, depth: 10}, scene);

    tiledBox.position = new BABYLON.Vector3(19,0,0)
    tiledBox2.position = new BABYLON.Vector3(-19,0,0)
    sphere.position = new BABYLON.Vector3(0,0,0)
    // tiledBox.checkCollisions = true;
    // tiledBox2.checkCollisions = true;
    // tiledBox.collisionsEnabled = true;
    // tiledBox2.collisionsEnabled = true;




    return scene;
};

/******* End of the create scene function ******/


let right = false;
let left = false;

var keyboard = new THREEx.KeyboardState();

var scene = createScene(); //Call the createScene function
var isCollisioning = false;

function checkMovement(){
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    let limit = (vw / vh * 19)
    //console.log(limit)
    let isInside = (scene.getMeshByName("box").position.z > limit * -1)
    let isInside2 = ( scene.getMeshByName("box").position.z < limit )

    let box2IsInside = (scene.getMeshByName("box2").position.z > limit * -1)
    let box2IsInside2 = ( scene.getMeshByName("box2").position.z < limit )

    if(keyboard.pressed("A") && isInside){
        console.log(scene.getMeshByName("box").position.z)
        scene.getMeshByName("box").position.z -= 1;
    }
    if(keyboard.pressed("D") && isInside2){
        console.log(scene.getMeshByName("box").position.z)
        scene.getMeshByName("box").position.z += 1;
    }
    if(keyboard.pressed("left") && box2IsInside){
        console.log(scene.getMeshByName("box2").position.z)
        scene.getMeshByName("box2").position.z -= 1;
    }
    if(keyboard.pressed("right") && box2IsInside2){
        console.log(scene.getMeshByName("box2").position.z)
        scene.getMeshByName("box2").position.z += 1;
    }
}

var goingUp = false;
var initialPosition = true;
var zMovement = Math.floor(Math.random() * 10) / 10;

function ballMovement(){
    if(scene.getMeshByName("sphere").intersectsMesh(scene.getMeshByName("box2"), true)){
        initialPosition = false;
        goingUp = true;
    } else if(scene.getMeshByName("sphere").intersectsMesh(scene.getMeshByName("box"), true)){
        initialPosition = false;
        goingUp = false;
    }

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    let limit = (vw / vh * 21)

    let isLeaving = (scene.getMeshByName("sphere").position.z > limit * -1)
    let isLeaving2 = ( scene.getMeshByName("sphere").position.z < limit )

    //ifLeaving || isLeaving2 ? scene.getMeshByName("sphere").position.x += zMovement * -1  : ''
    if(!isLeaving || !isLeaving2){
        scene.getMeshByName("sphere").position.x += zMovement * -1
        zMovement = zMovement * -1;
    }

    if(initialPosition || goingUp){
        scene.getMeshByName("sphere").position.x += 0.4;
    } else {
        scene.getMeshByName("sphere").position.x -= 0.4;
    }

    scene.getMeshByName("sphere").position.z -= zMovement;

}

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    //movementManagerA();
        checkMovement();
        //checkCollision();
        ballMovement();
        //sphere.position.x += 0.1;
        //camera.position.x += 0
        //scene.getMeshByName("sphere").position.x += 0.01;
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});