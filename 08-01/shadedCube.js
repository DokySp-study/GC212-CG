
var canvas;
var gl;
var program

var NumVertices  = 36;

var pointsArray = []
var normalArray = []

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
    vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
    vec4(  0.5,  0.5,  0.5, 1.0 ), // 2
    vec4(  0.5, -0.5,  0.5, 1.0 ), // 3
    vec4( -0.5, -0.5, -0.5, 1.0 ), // 4 
    vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
    vec4(  0.5,  0.5, -0.5, 1.0 ), // 6
    vec4(  0.5, -0.5, -0.5, 1.0 ),  // 7
];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0)
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0)
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0)
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0)

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0)
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0)
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0)

var materialShiness = 100.0

var ctm;
var ambientColor, diffuseColor, specularColor

var modelView
var projection

var viewerPos

var xAxis = 0
var yAxis = 1
var zAxis = 2
var axis = 0

var theta = [0, 0, 0]
var thetaLoc
var flag = true


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
	// gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.FRONT)

    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	colorCube();


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );



    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    thetaLoc = gl.getUniformLocation(program, "theta")

    projection = ortho(-1,1,-1,1,-100,100)

    var ambientProduct = mult(lightAmbient, materialAmbient)
    var diffuseProduct = mult(lightDiffuse, materialDiffuse)
    var specularProduct = mult(lightSpecular, materialSpecular)

    document.getElementById("btnX").onclick = () => {axis = xAxis; render();}
    document.getElementById("btnY").onclick = () => {axis = yAxis; render();}
    document.getElementById("btnZ").onclick = () => {axis = zAxis; render();}
    document.getElementById("btnT").onclick = () => {flag = !flag; render();}

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct))
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct))
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct))
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition))

    gl.uniform1f(gl.getUniformLocation(program, "shiness"), materialShiness)

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projection"), false, flatten(projection))

    
    render();

}





// Render function
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    if(flag) theta[axis] += 2.0
    
    modelView = mat4()
    modelView = mult(modelView, rotate(theta[xAxis], [1,0,0] ))
    modelView = mult(modelView, rotate(theta[yAxis], [0,1,0] ))
    modelView = mult(modelView, rotate(theta[zAxis], [0,0,1] ))

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelView"), false, flatten(modelView))

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}




// Build ColorCube
function colorCube() {
    quad( 1, 0, 3, 2 ); 
    quad( 2, 3, 7, 6 ); 
    quad( 3, 0, 4, 7 ); 
    quad( 6, 5, 1, 2 ); 
    quad( 4, 5, 6, 7 ); 
    quad( 5, 4, 0, 1 ); 
}

function quad(a, b, c, d) {
    
    var t1 = subtract( vertices[b], vertices[a] )
    var t2 = subtract( vertices[c], vertices[a] )
    var normal = cross(t1, t2)
    var normal = vec3(normal)

    pointsArray.push(vertices[a])
    normalArray.push(normal)
    pointsArray.push(vertices[b])
    normalArray.push(normal)
    pointsArray.push(vertices[c])
    normalArray.push(normal)
    pointsArray.push(vertices[a])
    normalArray.push(normal)
    pointsArray.push(vertices[c])
    normalArray.push(normal)
    pointsArray.push(vertices[d])
    normalArray.push(normal)
    
}