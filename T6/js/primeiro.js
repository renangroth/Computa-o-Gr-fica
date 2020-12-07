var scene;
var camera;
var renderer;

var velocity = 0.1;

var ground;

var objLoader;
var fbxLoader;
var textureLoader;

var spotLight;

var girafa;
var panda;
var veado;
var vaca;
var pterodactyl;
var arvore;
var galinha;
var corvo;

var lastLook = null;
var looking = false;

async function olhar(target) {
    if (looking) return;
    looking = true;

    lastLook = target;
    pos = new THREE.Vector3(lastLook.position.x, lastLook.position.y, lastLook.position.z);
    

    while (1) {
        let canbreak=true;

        console.log(pos);

        if (Math.abs(target.position.y-pos.y)>0.01) {
            canbreak = false;
            pos.y=(target.position.y+pos.y)/2;
        }

        if (Math.abs(target.position.x-pos.x)>0.01) {
            canbreak = false;
            pos.x=(target.position.x+pos.x)/2;
        }

        if (Math.abs(target.position.z-pos.z)>0.01) {
            canbreak = false;
            pos.z=(target.position.z+pos.z)/2;
        }

        camera.lookAt(pos);

        renderer.render( scene, camera );

        if (canbreak) break;

        await new Promise(r => setTimeout(r, 25));
    }

    looking = false;
}

var guiFunction = function(){
    const gui = new dat.GUI();

    param = {
        Girafa: () => {olhar(girafa)},   
        Panda: () => {olhar(panda)},
        Veado: () => {olhar(veado)}, 
        Corvo: () => {olhar(corvo)},
        Galinha: () => {olhar(galinha)},
        Vaca: () => {olhar(vaca)},
        Pterodactil: () => {olhar(pterodactil)},
        Arvore: () => {olhar(arvore)},
    };    

    gui.add(param, 'Girafa');
    gui.add(param, 'Panda');
    gui.add(param, 'Veado');
    gui.add(param, 'Corvo');
    gui.add(param, 'Galinha');
    gui.add(param, 'Vaca');
    gui.add(param, 'Pterodactil');
    gui.add(param, 'Arvore');

    gui.open();
   
};

var criaGround = function (){

    textureLoader = new THREE.TextureLoader();
    
    groundTexture = textureLoader.load('assets/textura/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 20, 20 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;
    material = new THREE.MeshBasicMaterial({map : groundTexture});
    
    material.normalMap =  textureLoader.load('assets/textura/terrain/grasslight-big-nm.jpg');

    ground = new  THREE.Mesh(
        new THREE.PlaneGeometry(1050, 1050, 25,25),
        material
    );

    ground.rotation.x -= Math.PI / 2;
    ground.position.y=-2;

    scene.add(ground);
};

var loadObj = function(){
    objLoader = new THREE.OBJLoader();
    fbxLoader = new THREE.FBXLoader();
    textureLoader = new THREE.TextureLoader();

    fbxLoader.load(
        'assets/models/Giraffe.fbx', //arquivo que vamos carregar
        function(object){
            girafa = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/Giraffe_UV.png");
                            child.material.shininess = 0;
                        }
                    });

            girafa.scale.x = 0.1;
            girafa.scale.y = 0.1;
            girafa.scale.z = 0.1;
            girafa.position.z = -50;
            girafa.position.x = 90;
            girafa.position.y = 10;
            girafa.castShadow = true;
            scene.add(girafa); 

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

    fbxLoader.load(
        'assets/models/Panda.fbx', //arquivo que vamos carregar
        function(object){
            panda = object;

            panda.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/Panda_UV.png");
                            child.material.shininess = 0;
                        }
                    });

            panda.scale.x = 0.04;
            panda.scale.y = 0.04;
            panda.scale.z = 0.04;
            panda.position.y = 0;
            panda.position.z = 20;
            panda.position.x = 110;
            panda.rotation.y -= 1;
            panda.castShadow = true;
            scene.add(panda); 

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

    fbxLoader.load(
        'assets/models/Chicken.fbx', //arquivo que vamos carregar
        function(object){
            galinha = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/UV Chicken.png");
                            child.material.shininess = 0;
                        }
                    });

            galinha.scale.x = 0.01;
            galinha.scale.y = 0.01;
            galinha.scale.z = 0.01;
            galinha.position.x = 12;
            galinha.position.z = 30;
            galinha.position.y = 5;
            galinha.rotation.y -= 0.4;
            galinha.castShadow = true;
            scene.add(galinha); 
            console.log(galinha);
            
        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% gpronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

    fbxLoader.load(
        'assets/models/Cow.fbx', //arquivo que vamos carregar
        function(object){
            vaca = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/UVCow.png");
                            child.material.shininess = 0;
                        }
                    });

            vaca.scale.x = 0.1;
            vaca.scale.y = 0.1;
            vaca.scale.z = 0.1;
            vaca.position.x = -18;
            vaca.position.z = 30;
            vaca.position.y = 0;
            vaca.rotation.y += 0.3;
            vaca.castShadow = true;
            scene.add(vaca); 

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% gpronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

    fbxLoader.load(
        'assets/models/Pterodactyl.fbx', //arquivo que vamos carregar
        function(object){
            pterodactil = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/UV Pterodactyl.png");
                            child.material.shininess = 0;
                        }
                    });

            pterodactil.scale.x = 0.04;
            pterodactil.scale.y = 0.04;
            pterodactil.scale.z = 0.04;
            pterodactil.position.z = -20;
            pterodactil.position.x = -15;
            pterodactil.position.y = 70;
            pterodactil.castShadow = true;
            scene.add(pterodactil);    

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );
    fbxLoader.load(
        'assets/models/Deer.fbx', //arquivo que vamos carregar
        function(object){
            veado = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/UV_Deer.png");
                            child.material.shininess = 0;
                        }
                    });

            veado.scale.x = 0.06;
            veado.scale.y = 0.06;
            veado.scale.z = 0.06;
            veado.position.y = 5;
            veado.position.z = 11;
            veado.position.x = -50;
            veado.rotation.y += 1;
            veado.castShadow = true;
            scene.add(veado); 
            console.log(veado);
            
        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% gpronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );
    
    fbxLoader.load(
        'assets/models/Raven.fbx', //arquivo que vamos carregar
        function(object){
            corvo = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/UVRaven.png");
                            child.material.shininess = 0;
                        }
                    });

            corvo.scale.x = 0.008;
            corvo.scale.y = 0.008;
            corvo.scale.z = 0.008;
            corvo.position.x = 26;
            corvo.position.z = 30;
            corvo.position.y = 27;
            corvo.rotation.y -= 0.85;
            scene.add(corvo);    

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

    objLoader.load(
        'assets/models/tree.obj', //arquivo que vamos carregar
        function(object){
            arvore = object;

            object.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            console.log(child);
                            child.material.map = textureLoader.load("assets/textura/Wood.jpg");
                        }
                    });

            arvore.scale.x = 50;
            arvore.scale.y = 50;
            arvore.scale.z = 50;
            arvore.position.x = 70;
            arvore.position.z = -30;
            arvore.position.y = 1;
            scene.add(arvore);    

        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca: " + error);
        } //metodo deu merda
    );

}

var init = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 180 );

    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  

    //createACube();

    loadObj();

    camera.position.z = 100;
    camera.position.y = 30;


    //Iluminação 
    //Não se preocupe com essa parte por enquanto, apenas usem :)
    spotLight = new THREE.SpotLight( 0xffffff );
    scene.add(spotLight);
    spotLight.position.set( 100, 100, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 100;
    spotLight.shadow.mapSize.height = 100;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 99;
    spotLight.shadow.camera.fov = 40;

    renderer.shadowMap.enable = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;


    
    scene.add(new THREE.AmbientLight( 0xffffff ));


    criaGround();

    guiFunction();

    render();
  
};

var ci = 0
var render = function() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}