var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var keyboard = {};
var player = { height:1.8, speed:0.2, canShoot:0 };

var loadingManager = null;
var RESOURCES_LOADED = false;

var models = { //  index de modelos
	machine: {
		obj:"assets/models/m4.obj",
		mtl:"assets/models/m4.mtl",
		mesh: null,
		castShadow:false
	},

	arvoreNatal: {
		obj:"assets/models/arvoreNatal.obj",
		mtl:"assets/models/arvoreNatal.mtl",
		mesh: null
	},

	presente1: {
		obj:"assets/models/presente1.obj",
		mtl:"assets/models/presente1.mtl",
		mesh: null
	}, 

	presente2: {
		obj:"assets/models/presente2.obj",
		mtl:"assets/models/presente2.mtl",
		mesh: null
	}, 

	presente3: {
		obj:"assets/models/presente3.obj",
		mtl:"assets/models/presente3.mtl",
		mesh: null
	}, 

	presente4: {
		obj:"assets/models/presente4.obj",
		mtl:"assets/models/presente4.mtl",
		mesh: null
	}, 

	presente5: {
		obj:"assets/models/presente5.obj",
		mtl:"assets/models/presente5.mtl",
		mesh: null
	},

	Alvo1: {
		obj:"assets/models/Alvo1.obj",
		mtl:"assets/models/Alvo1.mtl",
		mesh: null
	}, 

	Alvo2: {
		obj:"assets/models/Alvo2.obj",
		mtl:"assets/models/Alvo2.mtl",
		mesh: null
	}
};

var meshes = {}; // index de Mesh
var bullets = []; // array das balas

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	mesh = new THREE.Mesh();
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(30,30, 30,30),
		new THREE.MeshPhongMaterial({color:0x3D85C6})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);	

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18); // Luz 1
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
	light2 = new THREE.PointLight(0xffffff, 0.8, 18); // Poste
	light2.position.set(12,7,10);
	light2.castShadow = true;
	light2.shadow.camera.near = 0.1;
	light2.shadow.camera.far = 25;
	scene.add(light2);

	for( var _key in models ){
		(function(key){
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){			
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
function onResourcesLoaded(){//Malhas individuais
	meshes["playerweapon"] = models.machine.mesh.clone(); //arma do jogador
	meshes["playerweapon"].position.set(0,2,0);
	meshes["playerweapon"].scale.set(0.8,0.8,0.8);
	scene.add(meshes["playerweapon"]);

	meshes["arvoreNatal"] = models.arvoreNatal.mesh.clone();
	meshes["arvoreNatal"].position.set(12,0,10);
	meshes["arvoreNatal"].scale.set(3,3,3);
	scene.add(meshes["arvoreNatal"]);

	meshes["presente1"] = models.presente1.mesh.clone();
	meshes["presente1"].position.set(11,0,10);
	scene.add(meshes["presente1"]);

	meshes["presente2"] = models.presente2.mesh.clone();
	meshes["presente2"].position.set(13,0,11);
	scene.add(meshes["presente2"]);

	meshes["presente3"] = models.presente3.mesh.clone();
	meshes["presente3"].position.set(13,0,9);
	scene.add(meshes["presente3"]);

	meshes["presente4"] = models.presente4.mesh.clone();
	meshes["presente4"].position.set(12,0,9);
	scene.add(meshes["presente4"]);

	meshes["presente5"] = models.presente5.mesh.clone();
	meshes["presente5"].position.set(12,0,11);
	scene.add(meshes["presente5"]);

	meshes["Alvo1"] = models.Alvo1.mesh.clone();
	meshes["Alvo1"].position.set(-15,1.4,11);
	meshes["Alvo1"].rotation.y -= 3;
	meshes["Alvo1"].scale.set(5,5,5);
	scene.add(meshes["Alvo1"]);

	meshes["Alvo2"] = models.Alvo2.mesh.clone();
	meshes["Alvo2"].position.set(-11,1.4,15);
	meshes["Alvo2"].rotation.y -= 1.7;
	meshes["Alvo2"].scale.set(5,5,5);
	scene.add(meshes["Alvo2"]);
}

function animate(){
	requestAnimationFrame(animate);
	
	mesh.rotation.x += 0.0001;
	mesh.rotation.y += 0.0001;	
	
	// Atualiza posicao das balas
	for(var index=0; index<bullets.length; index+=1){
		if( bullets[index] === undefined ) continue;
		if( bullets[index].alive == false ){
			bullets.splice(index,1);
			continue;
		}
		bullets[index].position.add(bullets[index].velocity);
	}
	
	if(keyboard[87] ){ // W
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if (cliquePressionado && player.canShoot <= 0){ // Atira a bala
		var bullet = new THREE.Mesh( // cria a bala
			new THREE.SphereGeometry(0.03,6,6),
			new THREE.MeshBasicMaterial({color:0xffffff})
		);	
		
		bullet.position.set( // posiciona a bala para sair da arma do jogador
			meshes["playerweapon"].position.x,
			meshes["playerweapon"].position.y + 0.05,
			meshes["playerweapon"].position.z
		);
		
		bullet.velocity = new THREE.Vector3( // seta a velocidade da bala
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		
		// após 500ms retira a bala da scena
		bullet.alive = true;
		setTimeout(function(){
			bullet.alive = false;
			scene.remove(bullet);
		}, 500);
		
		// Adiciona a bala na scena com delay de 10ms por tiro
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 10;
	}
	if(player.canShoot > 0) player.canShoot -= 1;
	
	meshes["playerweapon"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
		camera.position.y - 0.5 + Math.sin(camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
	);
	meshes["playerweapon"].rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);
	renderer.render(scene, camera);
}

var cliquePressionado = false; //para controlar o tempo que o cara esta pressionando o botao do mouse
function onMouseDown (event){    cliquePressionado = true;}
function onMouseUp (event){    cliquePressionado = false;}
var posicaoMouser = { //controla a posicao do mouse
	x: 0,
	y: 0
};

var onMouseMouse = function (e){
	var deltaMovimento = {
		x: e.offsetX - posicaoMouser.x,
		y: e.offsetY - posicaoMouser.y,
	}

	camera.rotation.y += toRadians(deltaMovimento.x*0.1)*4;

	posicaoMouser = {  //nova posicao do mouser
		x : e.offsetX,
		y : e.offsetY
	};
}

function keyDown(event){	keyboard[event.keyCode] = true;}
function keyUp(event){	keyboard[event.keyCode] = false;}
function toRadians(angle) {	return angle * (Math.PI / 180);}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.addEventListener('mousedown', onMouseDown );
window.addEventListener('mouseup', onMouseUp ); 
document.addEventListener('mousemove', onMouseMouse ); 
window.onload = init;
