class Filtro{
    constructor(context, width, height){
        this.ctx = context;
        this.width = width;
        this.height = height;
    }

    //funciones de filtro
    aplicarSepia(imageData){
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for(let i = 0; i < imageData.data.length; i += 4 ){
            let red = imageData.data[i + 0];
            let green = imageData.data[i + 1];
            let blue = imageData.data[i + 2];

            let rr = 0.393 * red + 0.769 * green + 0.189 * blue;
            let gg = 0.349 * red + 0.686 * green + 0.168 * blue;
            let bb = 0.272 * red + 0.534 * green + 0.131 * blue;

            rr = Math.min(255, rr);
            gg = Math.min(255, gg);
            bb = Math.min(255, bb);

            imageData.data[i] = rr;
            imageData.data[i + 1] = gg;
            imageData.data[i + 2] = bb;
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    aplicarBinarizacion(imageData){
        let valorObte = 0;
        let umbral = 128;
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for(let i = 0; i < imageData.data.length; i += 4 ){
            let media = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            if(umbral < media){
                valorObte = 255;
            }
            else{
                valorObte = 0;
            }
            imageData.data[i] = valorObte;
            imageData.data[i + 1] = valorObte;
            imageData.data[i + 2] = valorObte;
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    aplicarBrillo(imageData){
        let factor = 30;
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for(let i = 0; i < imageData.data.length; i += 4 ){
            imageData.data[i] += factor;
            imageData.data[i + 1] += factor;
            imageData.data[i + 2] += factor;
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    aplicarNegativo(imageData){
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for(let i = 0; i < imageData.data.length; i += 4 ){
            imageData.data[i] = 255 - imageData.data[i];
            imageData.data[i + 1] = 255 - imageData.data[i + 1];
            imageData.data[i + 2] = 255 - imageData.data[i + 2];
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    aplicarSaturacion(imageData){
        let saturacion = 0.5;
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        for(let i = 0; i < imageData.data.length; i += 4 ){
            let red = imageData.data[i + 0];
            let green = imageData.data[i + 1];
            let blue = imageData.data[i + 2];

            let convertir = this.rgbAHsl(red, green, blue);

            convertir[1] += saturacion;
            convertir[1] = Math.max(0, Math.min(1, convertir[1]));

            let conver = this.hslARgb(convertir[0], convertir[1], convertir[2]);

            imageData.data[i] = conver[0];
            imageData.data[i + 1] = conver[1];
            imageData.data[i + 2] = conver[2];

        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    //Funcion para convertir de RGB a HSL, funcion perteneciente a aplicar saturacion
    rgbAHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; 
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = ((max - r) / 6 + (max - g) / 3 + (max - b) / 2) / d;
            h = h < 0 ? h + 1 : h;
            h = h > 1 ? h - 1 : h;
        }

        return [h, s, l];
    }

    //Funcion para convertir de HSL a RGB, funcion perteneciente a aplicar saturacion
    hslARgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            let hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

    aplicarBlur(imageData){
        imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        //tamañio para ajustar el desenfoque
        let tamanioFiltro = 7;
        let tamanioMedioFiltro = Math.floor(tamanioFiltro / 2);
    
        // Matriz temporal que almacena los valores nuevos de píxeles
        let temporal = new Uint8ClampedArray(imageData.data.length);
    
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let sumaRed = 0;
                let sumaGreen = 0;
                let sumaBlue = 0;
    
                // Se itera sobre los píxeles calculados
                for (let x = -tamanioMedioFiltro; x <= tamanioMedioFiltro; x++) {
                    for (let d = -tamanioMedioFiltro; d <= tamanioMedioFiltro; d++) {
                        let pixel = ((i + x) * this.width + (j + d)) * 4;
                        let redPixel = imageData.data[pixel];
                        let greenPixel = imageData.data[pixel + 1];
                        let bluePixel = imageData.data[pixel + 2];
    
                        sumaRed += redPixel;
                        sumaGreen += greenPixel;
                        sumaBlue += bluePixel;
                    }
                }
                // Calculamos el valor medio de los píxeles
                let red = sumaRed / (tamanioFiltro * tamanioFiltro);
                let green = sumaGreen / (tamanioFiltro * tamanioFiltro);
                let blue = sumaBlue / (tamanioFiltro * tamanioFiltro);
    
                let nuevoPixel = (i * this.width + j) * 4;
                temporal[nuevoPixel] = red;
                temporal[nuevoPixel + 1] = green;
                temporal[nuevoPixel + 2] = blue;
                temporal[nuevoPixel + 3] = imageData.data[nuevoPixel + 3]; // El valor de alpha se mantiene
            }
        }
    
        for (let s = 0; s < imageData.data.length; s++) {
            imageData.data[s] = temporal[s];
        }
    
        this.ctx.putImageData(imageData, 0, 0);
    }
}   