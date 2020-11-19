var scene;
var camera;
var renderer;

var velocity = 0.1;


var createACube = function() {
    var geometryCaixa = new THREE.BoxGeometry( 2, 10, 2 );

    red = new THREE.Color(1, 0, 0);
    green = new THREE.Color(0, 1, 0);
    blue = new THREE.Color(0, 0, 1);
    var colors = [red, green, blue];

    for (var i = 0; i < 3; i++) {
        geometryCaixa.faces[4 * i].color = colors[i];
        geometryCaixa.faces[4 * i+1].color = colors[i];
        geometryCaixa.faces[4 * i+2].color = colors[i];
        geometryCaixa.faces[4 * i+3].color = colors[i];

    }
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: true } );
    braco1 = new THREE.Mesh( geometryCaixa, material );
    

    var geometryEsfera = new THREE.SphereGeometry(2, 32,32);
    var geometryEsfera2 = new THREE.SphereGeometry(10, 32,32);
    var material2 = new THREE.MeshBasicMaterial( { color: new THREE.Color(0, 1, 0)} );
    cotovelo = new THREE.Mesh(geometryEsfera, material2);
    cotovelo.position.y-=5;
    braco1.add(cotovelo);

    pivot = new THREE.Group();
    pivot.position.set(0,0,0);
    pivot.add(braco1);

    scene.add(pivot);
    braco1.position.y+=pivot.position.x+5;

    var geometryCilindro = new THREE.CylinderGeometry( 2, 2, 6, 32 );
    var geometryCone = new THREE.ConeBufferGeometry(6, 8, 16);
    var geometryCone2 = new THREE.ConeBufferGeometry(6, -8, 16);
    var materialVermelho = new THREE.MeshBasicMaterial( { color: 0x5A1616} );
    var materialAzul = new THREE.MeshBasicMaterial( { color: 0x39B1DE} );
    var materialRosa = new THREE.MeshBasicMaterial( { color: 0xAB4A8E} );

    caixa = new THREE.Mesh( geometryCaixa, materialAzul );
    esfera = new THREE.Mesh( geometryEsfera2, materialRosa);
    esfera2 = new THREE.Mesh( geometryEsfera, materialAzul );
    cilindro = new THREE.Mesh( geometryCilindro, materialVermelho );
    cilindro2 = new THREE.Mesh( geometryCilindro, materialRosa );
    cilindro3 = new THREE.Mesh( geometryCilindro, materialRosa );
    cone = new THREE.Mesh( geometryCone, materialVermelho );
    cone2 = new THREE.Mesh( geometryCone2, materialVermelho );

    cone.position.x=20
    cone.position.y=-2
    cone.position.z=15
    scene.add( cone );

    
    cone2.position.x=20
    cone2.position.y=12
    cone2.position.z=15
    scene.add( cone2 );
    

    esfera.position.x=-7
    esfera.position.y=-25
    esfera.position.z=25
    scene.add( esfera );
    
    
    cilindro.position.x=-15
    cilindro.position.y=10
    cilindro.position.z=40
    scene.add( cilindro );
    
    
    caixa.position.x=-45
    caixa.position.y=20
    caixa.position.z=19
    scene.add( caixa );
    
    
    esfera2.position.x=20
    esfera2.position.y=5
    esfera2.position.z=15
    scene.add( esfera2 );
    

    cilindro2.position.x=30
    cilindro2.position.y=50
    cilindro2.position.z=20
    scene.add( cilindro2 );
    

    cilindro3.position.x=-50
    cilindro3.position.y=14
    cilindro3.position.z=100
    scene.add( cilindro3 );
};

var init = function() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 

                                60                                          // angulo
                                ,window.innerWidth / window.innerHeight     //aspect
                                ,0.1                                       // Near
                                ,1000                                      // Far
                            );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.createACube();

   
	camera.position.set( 0, 20, 100 );

    

    //Essas linhas criam o gridView, lembrando que ele basicamente Ã© sÃ³ uma grade de linhas no eixo X
    //scene.add( new THREE.GridHelper( 400, 40 ) );
  

    
   /*Para criar o plano */
   const ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 100, 100, 10 ),
        new THREE.MeshBasicMaterial( { color: 'orange'})
    ); //Cria a forma plana

    ground.rotation.x = - Math.PI / 2; // rotaciona para que ela fique paralela ao eixo X
    ground.position.y-=6; // Posiciona o ground abaixo da nossa figura.
    scene.add( ground );


    render();

    document.addEventListener('keydown', onKeyDown ); 

    document.addEventListener('mousedown', onMouseDown ); //metodos de controle do mouser
    document.addEventListener('mouseup', onMouseUp ); 
    document.addEventListener('mousemove', onMouseMouse ); 
  
};

var ci = 0
var render = function() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var rotationVelocity = 0.1;

var onKeyDown = function(e){

    if (e.keyCode == 38){ //Up
        camera.position.y+=0.5
    }
    if (e.keyCode == 40){ //Down
        camera.position.y-=0.5
    }
    if (e.keyCode == 39){ //direita
        camera.position.x+=0.5
    }
    if (e.keyCode == 37){ //esquerda
        camera.position.x-=0.5
    }
    if (e.keyCode == 81){ //Q
        camera.position.z+=0.5
    }
    if (e.keyCode == 65){ //A
        camera.position.z-=0.5
    }
    if (e.keyCode == 32){ //espaço
        //camera.position.applyQuaternion( new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), toRadians(5) ));
        camera.rotateY(toRadians(5))
    }
}


var posicaoMouser = { //controla a posiÃ§Ã£o do mouser
    x: 0,
    y: 0
};

var cliquePressionado = false; //para controlar o tempo que o cara esta pressionando o botao do mouser

var onMouseDown = function(e){
    cliquePressionado = true;
    //console.log("Apertou Clicou")
}


var onMouseUp = function(e){
    cliquePressionado = false;
  //  console.log("SOltou o clique");
}


var onMouseMouse = function (e){
    if (cliquePressionado){

        var deltaMovimento = {
            x: e.offsetX - posicaoMouser.x,
            y: e.offsetY - posicaoMouser.y,
        }

        //cube.position.x += deltaMovimento.x*0.01;
        //cube.position.y += deltaMovimento.y*0.01*-1;

        braco1.rotation.x += toRadians(deltaMovimento.y*1)*0.5;
        braco1.rotation.y += toRadians(deltaMovimento.x*1)*0.5;
    }

    posicaoMouser = {  //nova posiÃ§Ã£o do mouser
        x : e.offsetX,
        y : e.offsetY
    };
}

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}