class Imagen{
    constructor(context, width, height){
        this.ctx = context;
        this.width = width;
        this.height = height;
        this.imagenCargada = false;
    }

    //funcion de cargar imagen
    cargarImagen(fileName){
        let widthOr = this.width;
        let heightOr = this.height;
        let context = this.ctx;
        let imagen = new Image();
        imagen.src = URL.createObjectURL(fileName);
        imagen.onload = function () {
            const relaAspecto = this.naturalWidth / this.naturalHeight;
            let targetWidth = widthOr;
            let targetHeight = targetWidth / relaAspecto;
            if(targetHeight > heightOr){
                targetHeight = heightOr;
                targetWidth = targetHeight * relaAspecto;
            }
        context.drawImage(imagen, 0, 0, targetWidth, targetHeight);
        }
        return imagen;
    }
}