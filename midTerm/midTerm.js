    
    


// 버텍스, 컬러 어레이 생성
var colors = [
    vec4(1, 0, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(0, 0, 1, 1),

    vec4(1, 0, 0, 1),
    vec4(0, 0, 1, 1),
    vec4(1, 0, 1, 1),
]

var vertex = [
    vec2(0.5, 0.5),
    vec2(-0.5, 0.5),
    vec2(-0.5, -0.5),

    vec2(0.5, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
]

var modelView
var projection



window.onload = function init() {

    // 캔버스 가져오기
    var canvas = document.getElementById( "gl-canvas" );
    
    // 웹GL유틸즈 -> 셋업 웹지엘
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // 인잇_쉐이더 (쉐이더 초기화)
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    // 유즈_프로그램 (GL에 프로그램 추가)
    gl.useProgram( program );






    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Uniform
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
    


    // Vertex
    // 1. 버퍼 생성
    var bufferId = gl.createBuffer();
    // 2. 생성된 버퍼 -> 바인드버퍼
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    // 3. 생성된 버퍼 -> 데이터 추가
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertex), gl.STATIC_DRAW ); // flatten -> Tessellation

    // GPU attribute 가져오기 / 겟_에트립_로케이션
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    // 버텍스_애트립_포인터
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    // 인에이블_버텍스_에트립_어레이
    gl.enableVertexAttribArray( vPosition );


    // Colors
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    render()

}


const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var radius = 4.0
var theta = 0.5
var phi = 0.5

var fovy = 45
var aspect = 1.0
var near = 0.3
var far = 10


function render() {

    var eye = vec3(
        radius*Math.cos(theta)*Math.sin(phi), 
        radius*Math.sin(theta), 
        radius*Math.cos(theta)*Math.cos(phi)
    );

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far)  // Perspective view camera

	gl.uniformMatrix4fv( modelView, false, flatten(modelViewMatrix) )
    gl.uniformMatrix4fv( projection, false, flatten(projectionMatrix) )

    // Render part
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertex.length );

}




