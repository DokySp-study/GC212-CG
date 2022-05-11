
var gl;
var points;

// Change angle to radian value
var angleToRad = (angle) => {
    return Math.PI / 180 * angle
}

// Rotate coordinate with specific angle
var rotateXY = (x, y, rotate) => {
    xx = x * Math.cos(angleToRad(rotate)) - y * Math.sin(angleToRad(rotate))
    yy = x * Math.sin(angleToRad(rotate)) + y * Math.cos(angleToRad(rotate))
    return [xx, yy]
}

// Make ractangle's vertices
var makeRectangle = (width = 0.1, height = 0.1, rotate = 0.0) => {

    var vertices = [
        vec2( rotateXY((-width/2), (height/2), rotate)[0], rotateXY((-width/2), (height/2), rotate)[1] ),
        vec2( rotateXY((-width/2), (-height/2), rotate)[0], rotateXY((-width/2), (-height/2), rotate)[1] ),
        vec2( rotateXY((width/2), (height/2), rotate)[0], rotateXY((width/2), (height/2), rotate)[1] ),
        vec2( rotateXY((-width/2), (-height/2), rotate)[0], rotateXY((-width/2), (-height/2), rotate)[1] ),
        vec2( rotateXY((width/2), (-height/2), rotate)[0], rotateXY((width/2), (-height/2), rotate)[1] ),
    ]
    return vertices
}

// Make triangle's vertices
var makeTriangle = (width = 0.1, height = 0.1, rotate = 0.0) => {

    var vertices = [
        vec2( rotateXY(0, (height), rotate)[0], rotateXY(0, (height), rotate)[1] ),
        vec2( rotateXY((-width), (-height*0.7), rotate)[0], rotateXY((-width), (-height*0.7), rotate)[1] ),
        vec2( rotateXY((width), (-height*0.7), rotate)[0], rotateXY((width), (-height*0.7), rotate)[1] ),
    ]
    return vertices
}


// Make circle's vertices
var makeCircle = (radius = 0.5, width = 1, rotate = 0, minAngle = 5) => {
    
    var vertices = []

    for(var i = 0; i < 360; i += minAngle){
        vertices.push(vec2(0, 0))

        x = Math.cos(angleToRad(i)) * radius * width
        y = Math.sin(angleToRad(i)) * radius
        xn = Math.cos(angleToRad(i + minAngle)) * radius * width
        yn = Math.sin(angleToRad(i + minAngle)) * radius
        

        vertices.push(vec2( rotateXY(x, y, rotate)[0], rotateXY(x, y, rotate)[1] ))
        vertices.push(vec2(rotateXY(xn, yn, rotate)[0], rotateXY(xn, yn, rotate)[1]))

    }
    return vertices
}



var offset = 0.0;
var program
var buttonChange
var intv = 0.005

var clickBox = []

// OpenGL Code
window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.clear( gl.COLOR_BUFFER_BIT );
    

    // Add button to change animation's direction
    if(buttonChange == undefined){
        buttonChange = document.getElementById("btnChange")
        buttonChange.addEventListener("click", () => {
            intv = -intv
            console.log(clickBox)
        })
        
        // Add click event listener to draw additional shapes
        // This code will be executed just one time
        canvas.addEventListener("mousedown", (event) => {
            
            canvasX = 2 * (event.clientX / canvas.width) - 1 - 0.05
            canvasY = 2 * ((canvas.height - event.clientY) / canvas.height) - 1 + 0.1
            
            clickBox.push({x: canvasX, y: canvasY})
            
        })

    }

    // Load the data into the GPU (Below)
    // Gradient color background
    drawBackground()

    // Dot pattern in background
    changeShape = 0;
    for(var i = -0.5; i < 0.5; i += 0.05){
        for(var j = -0.5; j < 0.5; j += 0.05){
            switch(changeShape % 3){
                case 0: draw(program, makeRectangle(0.045, 0.045, (i+j)*159), [j * 3 - i + offset, - j - i * 3 - offset, 0], [0.95, 0.95, 0.95, 1]); break;
                case 1: draw(program, makeTriangle(0.03, 0.03, (i+j)*126), [j * 3 - i + offset, - j - i * 3 - offset, 0], [0.95, 0.95, 0.95, 1]); break;
                case 2: draw(program, makeCircle(0.03, 1, 0), [j * 3 - i + offset, - j - i * 3 - offset, 0], [0.95, 0.95, 0.95, 1]); break;
            }
            changeShape++;
        }
        changeShape++;
    }



    // Head, ears
    result = makeCircle(0.1067, 2.7188, 105) // 0: vertices, 0: colors
    draw(program, result, [-0.10, 0.06, 0], [1, 0.62, 0.11, 1])

    result = makeCircle(0.1268, 2.2878, 83)
    draw(program, result, [0.175, 0.05, 0], [1, 0.62, 0.11, 1])

    result = makeCircle(0.2657, 1.2272, 0) 
    draw(program, result, [0.007, -0.07, 0], [1, 0.62, 0.11, 1])

    // Left inner ear
    result = makeCircle(0.03895, 1.6777, 100)
    draw(program, result, [-0.14, 0.22, 0], [1, 0.95, 0.84, 1])

    // Right inner ear
    result = makeCircle(0.049, 1.7572, 83)
    draw(program, result, [0.19, 0.20, 0], [1, 0.95, 0.84, 1])

    // Head
    result = makeCircle(0.2906, 1, 0)
    draw(program, result, [0.005, -0.02, 0], [1, 0.62, 0.11, 1])

    // Cheek
    draw(program, makeCircle(0.09685, 1.2741, 1), [-0.03, -0.10, 0], [1, 0.95, 0.84, 1])
    draw(program, makeCircle(0.1057, 1.603, -23), [-0.11, -0.185, 0], [1, 0.95, 0.84, 1])
    draw(program, makeCircle(0.10715, 2.0789, 20), [0.075, -0.18, 0], [1, 0.95, 0.84, 1])

    // Mouth
    draw(program, makeCircle(0.0335, 1.4761, 1), [-0.085, -0.10, 0], [0.3, 0.00, 0.00, 1])
    draw(program, makeCircle(0.02515, 1.4761, 1), [-0.085, -0.10, 0], [1, 0.95, 0.84, 1])

    draw(program, makeCircle(0.0335, 1.6253, 1), [0.005, -0.10, 0], [0.3, 0.00, 0.00, 1])
    draw(program, makeCircle(0.02515, 1.6253, 1), [0.005, -0.10, 0], [1, 0.95, 0.84, 1])

    draw(program, makeRectangle(0.0368, 0.1216, -60), [-0.10, -0.08, 0], [1, 0.95, 0.84, 1])
    draw(program, makeRectangle(0.0535, 0.1216, 60), [0.04, -0.07, 0], [1, 0.95, 0.84, 1])
    
    // Nose
    result = makeCircle(0.0294, 1.571, 1)
    draw(program, result, [-0.04, -0.07, 0], [0.3, 0.00, 0.00, 1])

    result = makeCircle(0.0252, 2.165, 1)
    draw(program, result, [-0.04, -0.05, 0], [0.3, 0.00, 0.00, 1])

    // Cheek highlighter
    draw(program, makeCircle(0.03715, 1.6789, 5), [-0.22, -0.09, 0], [1, 0.84, 0.84, 1])
    draw(program, makeCircle(0.03715, 1.6789, -5), [0.165, -0.08, 0], [1, 0.84, 0.84, 1])

    // Eyebrow
    draw(program, makeCircle(0.031, 1.36, 11), [-0.17, 0.10, 0], [1, 0.95, 0.84, 1])
    draw(program, makeCircle(0.031, 1.6242, -10), [0.10, 0.102, 0], [1, 0.95, 0.84, 1])

    // Eye
    draw(program, makeCircle(0.0465, 1, 0), [-0.16, 0.01, 0], [0.3, 0.0, 0.0, 1])
    draw(program, makeCircle(0.0465, 1, 0), [0.09, 0.01, 0], [0.3, 0.0, 0.0, 1])

    // Eye hightlighter
    draw(program, makeCircle(0.015, 1, 0), [-0.145, 0.03, 0], [1., 1., 1., 1])
    draw(program, makeCircle(0.015, 1, 0), [0.105, 0.03, 0], [1., 1., 1., 1])
    


    // Draw arbitrary shape where user clicked
    for(var i = 0; i < clickBox.length; i++){

        var colorR = i / 2 % 1.1
        var colorG = i / 3 % 1.1
        var colorB = i / 4 % 1.1


        switch(i % 3){
            case 0: draw(program, makeRectangle(0.12, 0.12, (i+j)*159), [clickBox[i].x, clickBox[i].y, 0], [colorR, colorG, colorB, 1]); break;
            case 1: draw(program, makeTriangle(0.08, 0.08, (i+j)*126), [clickBox[i].x, clickBox[i].y, 0], [colorR, colorG, colorB, 1]); break;
            case 2: draw(program, makeCircle(0.08, 1, 0), [clickBox[i].x, clickBox[i].y, 0], [colorR, colorG, colorB, 1]); break;
        }
    }

    // Variable controlls for animate background pattern
    offset += intv
    if(offset >= 0.25) offset = -0.25
    else if(offset <= -0.25) offset = 0.25
    requestAnimationFrame(init)

};



// Draw function
var draw = (program, v, offset = [0,0,0], color = [0,0,0,1]) => {    
    // Vertex
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    // Add color vertex
    c = []
    for(var i=0; i < v.length; i++)
        c.push(vec4(color[0], color[1], color[2], color[3]))

    // Color
    var vertexColorBufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(c), gl.STATIC_DRAW)
    // NOTE: gl.bufferData(target, size, usage)
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // NOTE: gl.vertexAttribPointer(index, size, type, nomalized, stride, offset)
    gl.enableVertexAttribArray( vColor );


    // offset
    var uOffset = gl.getUniformLocation( program, "uOffset" )
    gl.uniform4fv(uOffset, [offset[0], offset[1], offset[2], 0])

    // Render part
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, v.length );

}

// Make background with faded color
var drawBackground = () => {
    
    v = [
        vec2(-1, 1),
        vec2(-1, -1),
        vec2(1, 1),
        vec2(-1, -1),
        vec2(1, -1),
    ]

    c = [
        vec4(1, 0.25, 0.25),
        vec4(0.75, 1, 0.25),
        vec4(0.7, 0.4, 0.9),
        vec4(0.75, 1, 0.25),
        vec4(0.4, 0.15, 1),
    ]

    // Vertex
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW ); // flatten -> Tessellation

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    // Color
    var vertexColorBufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(c), gl.STATIC_DRAW)
    // NOTE: gl.bufferData(target, size, usage)
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // NOTE: gl.vertexAttribPointer(index, size, type, nomalized, stride, offset)
    gl.enableVertexAttribArray( vColor );

    // Render part
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, v.length );
}

