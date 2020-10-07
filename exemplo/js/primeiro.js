var scene;
var camera;
var renderer;

var circle;
var velocidadeCircleX = 0.3;
var velocidadeCircleY = 0.3;


var criaCirculo = function(){
    var geometria = new THREE.SphereGeometry(5, 32, 32 );
    var material = new THREE.MeshBasicMaterial({color: "red"});
    
    circle = new THREE.Mesh( geometria, material);
    
    scene.add(circle);
};

var render = function(){
    requestAnimationFrame(render);

    animaCircle();

    renderer.render(scene, camera);
};

var animaCircle = function (){
    if (this.circle.position.x >= 33 || this.circle.position.x <= -33){
        velocidadeCircleX = velocidadeCircleX * -1;
    }
    if (this.circle.position.y >= 13 || this.circle.position.y <= -12){
        velocidadeCircleY = velocidadeCircleY * -1;
    }
    this.circle.position.x+= velocidadeCircleX;
    this.circle.position.y+= velocidadeCircleY;
    console.log("Posicao Circulo" + this.circle.position.x);
}

var init = function(){
scene  = new THREE.Scene();
camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000);

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


camera.position.z = 50;

criaCirculo();

render();

renderer.render(scene, camera);
};


window.onload = this.init;
