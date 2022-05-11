"use strict";

var canvas;
var gl;

var numVertices = 36;
var texSize = 64

var program

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
]

var vertices = [
    vec4 (-0.5, -0.5, 0.5, 1.0),
    vec4 (-0.5, 0.5, 0.5, 1.0),
    vec4 (0.5, 0.5, 0.5, 1.0),
    vec4 (0.5, -0.5, 0.5, 1.0),

    vec4 (-0.5, -0.5, -0.5, 1.0),
    vec4 (-0.5, 0.5, -0.5, 1.0),
    vec4 (0.5, 0.5, -0.5, 1.0),
    vec4 (0.5, -0.5, -0.5, 1.0),
]

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
]

var xAxis = 0
var yAxis = 1
var zAxis = 2

var axis = xAxis
var theta = [0, 0, 0]

var modelViewMatrixLoc


var image1 = new Array()
var image2 = new Uint8Array(4*texSize*texSize)

function createCheckboardPattern() {
    for (var i = 0; i < texSize; i++)
        image1[i] = new Array()
    
    for (var i = 0; i < texSize; i++)
        for (var j = 0; j < texSize; j++)
            image1[i][j] = new Float32Array(4)
        
    for (var i = 0; i < texSize; i++){
        for (var j = 0; j < texSize; j++){
            var c = ( ((i & 0x8) == 0) ^ ((j & 0x8) == 0) )
            image1[i][j] = [c, c, c, 1]
        }    
    }
    for (var i = 0; i < texSize; i++)
        for (var j = 0; j < texSize; j++)
            for (var k = 0; k < texSize; k++)
                image2[4*texSize*i+4*j+k] = 255 * image1[i][j][k]

}



function configureTexture(image) {
    var texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MAPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

}



function colorCube() {
    quad( 1, 0, 3, 2 ); // blue
    quad( 2, 3, 7, 6 ); // yellow
    quad( 3, 0, 4, 7 ); // green
    quad( 6, 5, 1, 2 ); // cyan
    quad( 4, 5, 6, 7 ); // red       
    quad( 5, 4, 0, 1 ); // magenta
}



function quad(a, b, c, d) {   
    pointsArray.push(vertices[a])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[0])

    pointsArray.push(vertices[b])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[1])

    pointsArray.push(vertices[c])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[2])

    pointsArray.push(vertices[a])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[0])

    pointsArray.push(vertices[c])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[2])

    pointsArray.push(vertices[d])
    colorsArray.push(vertexColors[a])
    texCoordsArray.push(texCoord[3])
}



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube()


    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);


    createCheckboardPattern()
    configureTexture(image2)

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );


    document.getElementById("ButtonX").onclick = function(){axis = xAxis; theta[axis] += 2.0;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis; theta[axis] += 2.0;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis; theta[axis] += 2.0;};


    render();
}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var ctm = mat4()
	ctm = mult(ctm, rotate(theta[zAxis], 0, 0, 1))
    ctm = mult(ctm, rotate(theta[yAxis], 0, 1, 0))
    ctm = mult(ctm, rotate(theta[xAxis], 1, 0, 0))

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices )

    window.requestAnimFrame(render);
}
