var scene;
var camera;
var renderer;

var velocity = 0.1;


var createACube = function() {
    var geometry = new THREE.BoxGeometry( 2, 10, 2 ); //RETANGULO BAIXO
    var material = new THREE.MeshBasicMaterial( { color: 0xD9CEAC} );
    cubo = new THREE.Mesh( geometry, material );
    

    var geometry2 = new THREE.SphereGeometry(2, 32,32); //ESFERA BAIXO
    var material2 = new THREE.MeshBasicMaterial( { color: 0xD9CEAC} );
    sphere = new THREE.Mesh(geometry2, material2);
    sphere.position.y+=5;
    cubo.add(sphere);


    var geometry3 = new THREE.SphereGeometry(2, 32,32); //ESFERA CIMA
    var material3 = new THREE.MeshBasicMaterial( { color: 0xD9CEAC} );
    sphere2 = new THREE.Mesh(geometry3, material3);
    sphere2.position.y+=9;
    

    var geometry4 = new THREE.BoxGeometry( 2, 10, 2 ); //RETANGULO CIMA OMBRO
    var material4 = new THREE.MeshBasicMaterial( { color: 0xD9CEAC} );
    cubo2 = new THREE.Mesh( geometry4, material4 );
    cubo2.position.y-=5;
    sphere2.add( cubo2 );



    pivot = new THREE.Group();
    pivot.position.set(0,0,0);
    pivot.add(cubo);
    

    scene.add(pivot);
    cubo.position.y+=pivot.position.x-5;
    

    pivot2 = new THREE.Group();
    pivot2.position.set(0,10,0);
    pivot2.add(sphere2);

    scene.add(pivot2);
    sphere2.position.y+=pivot2.position.x-9;
};

var init = function() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.createACube();

    camera.position.z = 100;

    render();

    document.addEventListener('keydown', onKeyDown ); 
  
};

var ci = 0
var render = function() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var rotationVelocity = 0.1;

var onKeyDown = function(e){
    console.log(e.keyCode);
    if (e.keyCode == 32){ //espaco 
        
        console.log("Z: "+ pivot.rotation.z);
        if (pivot.rotation.z > -0.1 || pivot.rotation.z < -2.8){
            rotationVelocity*=-1;
        }
        pivot.rotation.z+=rotationVelocity; 
    }
    
    if (e.keyCode == 37){ //Seta Esquerda
        
        console.log("Z: "+ pivot2.rotation.z);
        if (pivot2.rotation.z > -0.1 || pivot2.rotation.z < -2.8){
            rotationVelocity*=-1;
        }
        pivot2.rotation.z+=rotationVelocity; 
    }
    
}


window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}