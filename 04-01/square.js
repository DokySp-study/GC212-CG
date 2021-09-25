
var gl;
var points;


var points = []
const NumTimesToSubdevide = 10

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        // leaf
        vec2(0, 1),
        vec2(-1, -1),
        vec2(1, -1),
    ]

    divideTriangles(vertices, NumTimesToSubdevide)

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Load the data into the GPU

    // Vertex
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Render part
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, points.length)

};

var divideTriangles = (vertices, count) => {
    
    const a = vertices[0]
    const b = vertices[1]
    const c = vertices[2]

    if(count == 0){
        points.push(a, b, c)
    } else {

        var ab = mix(a, b, 0.5)
        var ac = mix(a, c, 0.5)
        var bc = mix(b, c, 0.5)

        count--

        divideTriangles([a, ab, ac], count)
        divideTriangles([c, ac, bc], count)
        divideTriangles([b, bc, ab], count)

    }

}