const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let hue = 0;
let hearts = [];

// Resize handler
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class HeartEcho {
    constructor(scale, opacity) {
        this.scale = scale;
        this.opacity = opacity;
        this.hue = hue;
    }

    draw() {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(this.scale, -this.scale); // Invert Y because canvas Y is down
        
        ctx.beginPath();
        // Drawing the heart shape using parametric equations
        for (let t = 0; t <= Math.PI * 2; t += 0.01) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.scale += 0.5;   // Echo moves outward
        this.opacity -= 0.01; // Echo fades away
    }
}

function animate() {
    // 1. Rainbow Background
    // We use a low alpha to leave "trails" or a solid fill for a clean background
    hue = (hue + 1) % 360;
    ctx.fillStyle = `hsla(${hue}, 40%, 10%, 1)`; // Dark rainbow background
    ctx.fillRect(0, 0, width, height);

    // 2. The Main Heart Beat
    // Pulse scale using a Sine wave
    const pulse = 10 + Math.sin(Date.now() * 0.01) * 2;
    
    // 3. Create Echos
    // Every few frames, add a new echo at the current pulse size
    if (Math.random() > 0.8) {
        hearts.push(new HeartEcho(pulse, 0.5));
    }

    // 4. Update and Draw Echos
    hearts.forEach((h, index) => {
        h.update();
        h.draw();
        if (h.opacity <= 0) hearts.splice(index, 1);
    });

    // 5. Draw the main "Solid" heart
    const mainHeart = new HeartEcho(pulse, 1);
    mainHeart.draw();

    requestAnimationFrame(animate);
}

animate();