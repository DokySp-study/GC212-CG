
var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        // leaf
        vec2(-1, 1),
        vec2(1, -1),
        vec2(-1, -1),
        vec2(1, 1),
        vec2(-1, -1),
        vec2(1, -1),
    ]

    var colors = [
        // leaf
        vec4(0.5, 1, 0.5, 1),
        vec4(0, 0, 0.5, 1),
        vec4(1, 0, 0.5, 1),
        vec4(1, 0, 0.5, 1),
        vec4(1, 0, 0.5, 1),
        vec4(0, 0, 0.5, 1),
        
    ]

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Associate vertex data buffer with shader variables
    
    var vPosition = gl.getAttribLocation( program, "vColor" );

    // Load the data into the GPU

    // Vertex
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Color
    var vertexColorBufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)
    // gl.bufferData(target, size, usage)
    
    var vColor = gl.getAttribLocation(program, "vColor")
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
    // gl.vertexAttribPointer(index, size, type, nomalized, stride, offset)
    gl.enableVertexAttribArray(vColor)

    
    // Render part
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

};

