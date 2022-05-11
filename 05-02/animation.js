
var gl;
var points;



var canvas;
var gl;

var maxNumberOfTriangle = 200;
var maxNumberVertices = 3 * maxNumberOfTriangle;
var index = 0;
var isDraw = false;


var colors = [
    vec4(0,0,0,1),
    vec4(1,0,0,1),
    vec4(0,1,0,1),
    vec4(0,0,1,1),
    vec4(1,1,0,1),
    vec4(0,1,1,1),
    vec4(1,0,1,1),
]



window.onload = function init() {

    // 캔버스 가져오기
    canvas = document.getElementById( "gl-canvas" );
    
    // 웹GL유틸즈 -> 셋업 웹지엘
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    // 인잇_쉐이더 (쉐이더 초기화)
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    // 유즈_프로그램 (GL에 프로그램 추가)
    gl.useProgram( program );






    canvas.addEventListener("mousedown" ,() => {
        isDraw = true;
    })

    canvas.addEventListener("mouseup" ,() => {
        isDraw = false;
    })

    canvas.addEventListener("mousemove" ,(event) => {
        
        if(isDraw) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            var t = vec2(
                2 * event.clientX / canvas.width - 1,
                2 * (canvas.height - event.clientY) / canvas.height - 1
            )
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t))

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            t = vec4(colors[(index) % 7])
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t))
            
            index++
        }
    })






    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumberVertices, gl.STATIC_DRAW)

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)



    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumberVertices, gl.STATIC_DRAW)

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vColor)

    render()

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, index)

    requestAnimFrame(render)
}
