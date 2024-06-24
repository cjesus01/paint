class Lapiz{
    constructor(posX, posY, fill, context, estilo){
        this.antX = posX;
        this.antY = posY;
        this.posX = posX;
        this.posY = posY;
        this.ctx = context;
        this.estilo = estilo;
        this.fill = fill;
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;//se setea el grosor de la linea
        this.ctx.strokeStyle = this.fill;
        this.ctx.moveTo(this.antX, this.antY); //muevo desde las coordenada originales
        this.ctx.lineTo(this.posX, this.posY);//muevo a las coordenada nuevas
        this.ctx.stroke(); 
        this.ctx.closePath();
    }

    moveTo(posX, posY){
        this.antX = this.posX;
        this.antY = this.posY;
        this.posX = posX;
        this.posY = posY;
    }
}