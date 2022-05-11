
window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 150;
	camera.position.y = 150;
	camera.position.z = 150;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	hlight = new THREE.AmbientLight (0x0000FF,5);
	scene.add(hlight);
	
	light = new THREE.PointLight(0xAAAA55,5);
	light.position.set(1000,1000,3000);
	scene.add(light);

	light2 = new THREE.PointLight(0xFFFF77,5);
	light2.position.set(1000,1000,-3000);
	scene.add(light2);

	light3 = new THREE.PointLight(0x993333,1);
	light3.position.set(0,-1000,);
	scene.add(light3);



	const loader = new THREE.GLTFLoader();
	loader.load('./model/scene.gltf', function(gltf){
	  car = gltf.scene.children[0];
	  car.rotation.z = -1.5708
	  car.scale.set(30,30,30);
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	var time = 0
	function animate() {
	   car.rotation.x = time += 0.005
	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}

}


