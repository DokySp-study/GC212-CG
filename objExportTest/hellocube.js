
window.onload = function init() 
{ 


  // 카메라 컨트롤: https://threejsfundamentals.org/threejs/lessons/kr/threejs-cameras.html
  const canvas = document.getElementById( "gl-canvas" );
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 25
  camera.position.y = 20
  camera.position.z = 30
  camera.lookAt(0,0,0) // 0,0,0을 향해서 봄
  
  


  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(20, 60, 50);
    scene.add(light);
  }

  const boxWidth = 10;
  const boxHeight = 10;
  const boxDepth = 10;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0, 0, 0),
    makeInstance(geometry, 0x8844aa, -10, 0, 0),
    makeInstance(geometry, 0xaa8844,  10, 0, 0),
    

  ]


  

  function render(time) {
    time *= 0.001;  // convert time to seconds

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * .1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });

    renderer.render(scene, camera);

    // requestAnimationFrame(render);
  }

  exportText = document.getElementById("export")
  

  render(render);	



  // Obj 파일 출력
  // https://stackoverflow.com/questions/19351419/exporting-threejs-scene-to-obj-format
  var exporter = new THREE.OBJExporter();
  var objCode = exporter.parse(scene);

  // https://learngrid.tistory.com/12
  var text = 'Text to File'
  var link = document.getElementById("download")
  link.download = 'test.obj';
  var blob = new Blob([objCode], {type: 'text/plain'});
  link.href = window.URL.createObjectURL(blob);

}
