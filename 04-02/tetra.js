
var gl;
var points;

var points = []
var colors = []
const NumTimesToSubdevide = 4

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        // leaf
        vec3(0.0, 0.0, -1.0),
        vec3(0.0, 0.9428, 0.3333),
        vec3(-0.8165, -0.4714, 0.3333),
        vec3(0.8165, -0.4714, 0.3333),
    ]

    divideTetra(vertices, NumTimesToSubdevide)

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Enable hidden-serface removal
    gl.enable(gl.DEPTH_TEST)

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Load the data into the GPU

    // Vertex
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Color
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );



    // Render part
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Enable hidden-serface removal
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

};

// Build tetra with recursion function
var divideTetra = (vertices, count) => {
    
    const a = vertices[0]
    const b = vertices[1]
    const c = vertices[2]
    const d = vertices[3]

    if(count == 0){
        tetra(a, b, c, d)
    } else {

        var ab = mix(a, b, 0.5)
        var ac = mix(a, c, 0.5)
        var ad = mix(a, d, 0.5)
        var bc = mix(b, c, 0.5)
        var bd = mix(b, d, 0.5)
        var cd = mix(c, d, 0.5)

        count--

        divideTetra([a, ab, ac, ad], count)
        divideTetra([ab, b, bc, bd], count)
        divideTetra([ac, bc, c, cd], count)
        divideTetra([ad, bd, cd, d], count)

    }

}

// Make tetra with triangles
var tetra = (a, b, c, d) => {
    triangle(b, c, d, 3) // triangle black
    triangle(a, c, b, 0) // triangle R
    triangle(a, c, d, 1) // triangle G
    triangle(a, b, d, 2) // triangle B
}

// Draw triangles
var triangle = (a, b, c, colorIdx) => {
    var baseColor = [
        vec3(1.0, 0.0, 0.0), // R 
        vec3(0.0, 1.0, 0.0), // R 
        vec3(0.0, 0.0, 1.0), // R 
        vec3(0.0, 0.0, 0.0), // Black
    ]

    points.push(a)
    points.push(b)
    points.push(c)
    colors.push(baseColor[colorIdx])
    colors.push(baseColor[colorIdx])
    colors.push(baseColor[colorIdx])

}