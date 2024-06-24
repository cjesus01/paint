//tomamos las distintas variables
//variables
let canvas = document.querySelector("#mi_canvas");
let ctx = canvas.getContext('2d');
let lapiz = document.querySelector('#lapiz'); 
let goma = document.querySelector('#goma');
let cargarImg = document.querySelector('#cargar_boton');
let filtro = document.querySelector('#filtro'); //id boton para filtros
let filtroApli = document.querySelectorAll('.appFiltro')// class botones donde estan cada filtro
let opcionFiltro = document.querySelector('.opcionesFiltro');
let dialogo = document.querySelector('#dialogo');
let cerrar = document.querySelector('#cerrar');
let file = document.querySelector('#fileInput');
let limpiar = document.querySelector('#limpiar');
let descargar = document.querySelector('#descargar');

//variables colores
let opciones = document.querySelector('.opciones'); //contenedor de opciones 
let colorSele = document.querySelector('.colorSeleccionado'); // color al lado del indicador lapiz
let colores = document.querySelectorAll('#color'); // id de botones de cada color
//colores
let colorN = document.querySelector('.negro');
let colorR = document.querySelector('.rojo');
let colorA = document.querySelector('.azul');
let colorM = document.querySelector('.marron');
let colorV = document.querySelector('.verde');
let colorNara = document.querySelector('.naranja');

//variables canvas
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let mouseUp = true;
let mouseDown = false;
let clickPen = false;
let clickGoma = false;
let miLapiz = null;
let miGoma = null;

//Selecciona un evento para poder utilizar las herramientas
function main(){
    seleccionarEvento();
    cambiarImagen();
}

//Inicializa el evento lapiz, goma, cargar imagen y filtro.
function seleccionarEvento(){
    //despliega el menu de color y al seleccionar el color lo esconde colocandole true el lapiz y false la goma para que no se crucen herramientas al usarlas.
    lapiz.addEventListener('click', e => {
        clickGoma = false; 
        clickPen = true;  
        opciones.classList.toggle("active");
        opciones.addEventListener('click', e =>{
            opciones.classList.remove("active");
        })
    })
    //Dirige a la funcion borrar, colocandole true a la goma y false al lapiz para que no se crucen herramientas al usarlas .
    goma.addEventListener('click', e =>{
        clickGoma = true; 
        clickPen = false;
        borrar();
    })
    //Dirige a la funcion colocar imagen
    cargarImg.addEventListener('click', e =>{
        colocarImagen();
    })
    //Dirige a la funcion filtro
    filtro.addEventListener('click', e => {
        opcionFiltro.classList.toggle("active");
        opcionFiltro.addEventListener('click', e =>{
            opcionFiltro.classList.remove("active");
        })
    })
}

//Funcion que recorre los botones almacenados dentro de la clase opciones, tomandolos todo desde el id color que comparten
//para que al hacer click obtenga la ruta de la imagen y la cambie al lado del lapiz a fin de mostrar el color con el que se esta pintando.
//luego se dirige hacia la funcion asignar color llevando por parametro el color donde se hizo click
function cambiarImagen(){
    colores.forEach( function (color) {
        color.addEventListener('click', function() {
            let imagen = this.querySelector('img');
            let ruta = imagen.src;
            colorSele.src = ruta;
            asignarColor(colorSele);
        })
    })
}

//La funcion trae por parametro la ruta guardada en cambiar imagen. Lo que hace esto esta funcion es comparar la ruta de la imagen que viene por parametro
//en donde el usuario hace click con las variables goblales. Esto es asi para que donde se igualan los valores, se le pase el color 
//a la clase lapiz el color que corresponde a la imagen. Se debe seleccionar un color para pintar, luego se ira a la funcion pintar con el parametro que es el color seleccionado
function asignarColor(colorSele){
    if(colorN.src == colorSele.src){
        colorSele = 'black';
    }
    else if(colorR.src == colorSele.src){
        colorSele = 'red';
    }
    else if(colorA.src == colorSele.src){
        colorSele = 'blue';
    }
    else if(colorM.src == colorSele.src){
        colorSele = 'brown';
    }
    else if(colorV.src == colorSele.src){
        colorSele = 'green';
    }
    else{
        colorSele = 'orange';
    }
    pintar(colorSele);
}

//Trae por parametro el color que eligio el ususario y dentro del if si el clickPen es verdadero realiza las funciones para pintar. En caso de
//querer limpiar el canvas por que se quiere borrar todo lo dibujado al apretar el boton limpiar se activa este evento 
function pintar(colorSele){
    if(clickPen){
        canvas.addEventListener('mousedown', (e) => {
                    mouseDown = true;
                    mouseUp = false;
                    miLapiz = new Lapiz(e.offsetX, e.offsetY, colorSele, ctx, colorSele);
        })
    
        canvas.addEventListener('mousemove', (e) => {
            if(mouseDown && miLapiz != null){
                miLapiz.moveTo(e.offsetX, e.offsetY);
                miLapiz.draw();
            }
        })

        canvas.addEventListener('mouseup', (e) => {
            mouseDown = false;
            mouseUp = true;
        })
    }
    limpiar.addEventListener('click', e => {
        ctx.clearRect(0, 0, widthCanvas, heightCanvas);
    })
}

//Se activa esta funcion cuando se dispara el evento de la goma al hacer click en el boton correspondiente, si el if en clickGoma es verdadero
//realiza las funciones para borrar. 
function borrar(){
    if(clickGoma){
        canvas.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseUp = false;
            miLapiz = new Goma(e.offsetX, e.offsetY, 'white', ctx, 'white');
        })        
        canvas.addEventListener('mousemove', (e) => {
            if(mouseDown && miLapiz != null){
                miLapiz.moveTo(e.offsetX, e.offsetY);
                miLapiz.draw();
            }
        })
        canvas.addEventListener('mouseup', (e) => {
            mouseDown = false;
            mouseUp = true;
        })
    }
}

//Colocamos la imagen a traves de la etiqueta dialogo que se despliega y muestra un input de carga de imagen. Tomamos el evento con file y 
//creamos un objeto Imagen guardandolo en una variable y lo enviamos a la funcion cargar imagen que se encuentra en la clase pasandole 
//como parametro la imagen. Tambien dirigimos a la opcion filtro pasandole la imagen y cerramos esta etiqueta haciendo click en el boton cerrar
function colocarImagen(){
    dialogo.showModal();
        file.addEventListener('change', e =>{
            let imagen = new Imagen(ctx, widthCanvas, heightCanvas);
            imagen.cargarImagen(e.target.files[0]);
            aplicarFiltro(e.target.files[0])
        })
        cerrar.addEventListener('click', e => {
            dialogo.close();
        })
}

//Funcion que recorre los botones almacenados dentro de la clase opciones, tomandolos todo desde el class appFiltro que comparten, al hacer click 
//en filtrar activa el evento toma el nombre del filtro por id ya que cada uno tiene su nombre. Tambien se crea una clase filtro. Luego igualamos
//el id obtenido cuando se iguale va a dirigirse a la clase filtro a la funcion correspondiente pasando por parametro la imagen.
//Al apretar el boton descargar va a la funcion descargar y en caso de apretar el boton limpiar se borra lo que esta en el canvas.
function aplicarFiltro(imageData){
    filtroApli.forEach( function (filtrar){
        filtrar.addEventListener('click', function() {
            let filtroElegido = this.id;
            let filtroCla = new Filtro(ctx, widthCanvas, heightCanvas);  
            if(filtroElegido == 'colorFSe') {
                filtroCla.aplicarSepia(imageData);
            }
            else if(filtroElegido == 'colorFB'){
                filtroCla.aplicarBinarizacion(imageData);
            }
            else if(filtroElegido == 'colorB'){
                filtroCla.aplicarBrillo(imageData);
            }
            else if(filtroElegido == 'colorF'){
                filtroCla.aplicarNegativo(imageData);
            }
            else if(filtroElegido == 'colorFS'){
                filtroCla.aplicarSaturacion(imageData);
            }
            else{
                filtroCla.aplicarBlur(imageData);
            }
        })
    })
    descargar.addEventListener('click', e =>{
        descargarImagen();
    })
    limpiar.addEventListener('click', e => {
        ctx.clearRect(0, 0, widthCanvas, heightCanvas);
    })
}

//Se descarga la imagen 
function descargarImagen(){
    let urlImg = document.createElement('a');
    urlImg.download = "Imagenes.jpg";
    urlImg.href = canvas.toDataURL();
    urlImg.click();
}


