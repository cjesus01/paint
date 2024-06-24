class Goma{
    constructor(posX, posY, fill, context, estilo){
        this.antX = posX;
        this.antY = posY;
        this.posX = posX;
        this.posY = posY;
        this.ctx = context;
        this.fill = fill;
        this.estilo = estilo;
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = this.fill;
        this.ctx.moveTo(this.antX, this.antY); 
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    moveTo(posX, posY){
        this.posX = posX + 5;
        this.posY = posY + 5;
    }
}