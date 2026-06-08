class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.matrixInterval = null;
        this.rainDrops = [];
        this.fontSize = 16;
        this.characters = "0123456789:3🐾/*-+".split("");
        
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.draw = this.draw.bind(this);
    }

    init() {
        this.canvas.style.display = "block";
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas);

        const columns = this.canvas.width / this.fontSize;
        for (let x = 0; x < columns; x++) {
            this.rainDrops[x] = 1;
        }

        this.matrixInterval = setInterval(this.draw, 30);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "rgba(115, 218, 202, 0.85)";
        this.ctx.font = this.fontSize + "px monospace";

        for (let i = 0; i < this.rainDrops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.rainDrops[i] * this.fontSize);

            if (this.rainDrops[i] * this.fontSize > this.canvas.height && Math.random() * 0.975 > 0.95) {
                this.rainDrops[i] = 0;
            }
            this.rainDrops[i]++;
        }
    }

    stop() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
            this.canvas.style.display = "none";
            window.removeEventListener("resize", this.resizeCanvas);
        }
    }

    isActive() {
        return this.matrixInterval !== null;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

window.MatrixRain = MatrixRain;