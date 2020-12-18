var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, canShoot:0 };
var USE_WIREFRAME = false;

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

//  index de modelos
var models = {
	machine: {
		obj:"assets/models/machinegun.obj",
		mtl:"assets/models/machinegun.mtl",
		mesh: null,
		castShadow:false
	}
};

// index de Mesh
var meshes = {};

// array das balas
var bullets = [];

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	clock = new THREE.Clock();
	
	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	);
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(60,60, 30,30),
		new THREE.MeshPhongMaterial({color:0x3D85C6, wireframe:USE_WIREFRAME})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);
	

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	

	var textureLoader = new THREE.TextureLoader(loadingManager);
	
	
	// Load models
	// REMEMBER: Loading in Javascript is asynchronous, so you need
	// to wrap the code in a function and pass it the index. If you
	// don't, then the index '_key' can change while the model is being
	// downloaded, and so the wrong model will be matched with the wrong
	// index key.
	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							if('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;
							
							if('receiveShadow' in models[key])
								node.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
	
	
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();
}

// É executado quando todos os recursos são carregados
function onResourcesLoaded(){
	// Reposiciona malhas individuais e, em seguida, adicione as malhas à cena
	
	//  arma do jogador
	meshes["playerweapon"] = models.machine.mesh.clone();
	meshes["playerweapon"].position.set(0,2,0);
	meshes["playerweapon"].scale.set(10,10,10);
	scene.add(meshes["playerweapon"]);
}


function animate(){

	// Joga a tela de carregamento até que os recursos sejam carregados
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}

	requestAnimationFrame(animate);
	
	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
	
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	
	
	// ir até a matriz de balas e atualizar a posição
	// remove balas quando apropriado
	for(var index=0; index<bullets.length; index+=1){
		if( bullets[index] === undefined ) continue;
		if( bullets[index].alive == false ){
			bullets.splice(index,1);
			continue;
		}
		
		bullets[index].position.add(bullets[index].velocity);
	}
	
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}

	// joga a bala
	if (cliquePressionado && player.canShoot <= 0){
		// cria a bala como um Mesh objeto
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(0.05,8,8),
			new THREE.MeshBasicMaterial({color:0xffffff})
		);
		
		// posiciona a bala para sair da arma do jogador
		bullet.position.set(
			meshes["playerweapon"].position.x,
			meshes["playerweapon"].position.y + 0.05,
			meshes["playerweapon"].position.z
		);
		
		// seta a velocidade da bala
		bullet.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		

		// após 1000 ms, definir ativo como falso e remover da cena
		// definindo ativo para false flags nosso código de atualização para remover
		// o marcador da matriz de balas
		bullet.alive = true;
		setTimeout(function(){
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);
		
		// add to scene, array, and set the delay to 10 frames
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 10;
	}
	if(player.canShoot > 0) player.canShoot -= 1;
	
	// posição da arma na frente da câmera
	meshes["playerweapon"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
	);
	meshes["playerweapon"].rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);
	
	
	renderer.render(scene, camera);
}

var cliquePressionado = false; //para controlar o tempo que o cara esta pressionando o botao do mouser

function onMouseDown (event){
    cliquePressionado = true;
    //console.log("Apertou Clicou")
}

function onMouseUp (event){
    cliquePressionado = false;
  //  console.log("SOltou o clique");
}

var posicaoMouser = { //controla a posiÃ§Ã£o do mouser
	x: 0,
	y: 0
};

var onMouseMouse = function (e){
	var deltaMovimento = {
		x: e.offsetX - posicaoMouser.x,
		y: e.offsetY - posicaoMouser.y,
	}


	//console.log("pos mouser y: ", posicaoMouser.y)


	camera.rotation.y += toRadians(deltaMovimento.x*0.1)*4;
	
	console.log("camera rot x", camera.rotation.x)
	console.log("camera rot y", camera.rotation.y)



	posicaoMouser = {  //nova posiÃ§Ã£o do mouser
		x : e.offsetX,
		y : e.offsetY
	};
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousedown', onMouseDown ); //metodos de controle do mouser
window.addEventListener('mouseup', onMouseUp ); 
document.addEventListener('mousemove', onMouseMouse ); 

window.onload = init;
