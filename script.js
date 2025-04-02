const canvas = document.getElementById('rocketCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Extended rocket colors with mixed colors
const colors = [
    '#ff0000',  // Red
    '#0000ff',  // Blue
    '#00ff00',  // Green
    '#ffff00',  // Yellow
    '#800080',  // Purple
    '#ff00ff',  // Magenta
    '#00ffff',  // Cyan
    '#ff8800',  // Orange
    '#8800ff',  // Violet
    '#00ff88',  // Turquoise
    '#ff0088',  // Pink
    '#88ff00',  // Lime
    '#0088ff',  // Light Blue
    '#ff8800',  // Deep Orange
    '#8800ff'   // Deep Purple
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.life = 2000; // 2 seconds in milliseconds
        this.createdAt = Date.now();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life = 2000 - (Date.now() - this.createdAt);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Rocket {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1.5 + Math.random() * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 20;
        this.active = true;
        this.hasCollided = false;
    }

    update() {
        if (!this.active) return false;

        // Move rocket
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Check for wall collision
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            // Reset position to prevent going outside bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
            
            if (!this.hasCollided) {
                this.hasCollided = true;
                this.active = false;
                return true; // Indicates collision
            }
        }
        return false;
    }

    draw() {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw rocket body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, -this.size/2);
        ctx.lineTo(-this.size, this.size/2);
        ctx.closePath();
        ctx.fill();

        // Draw rocket flame
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size/2);
        ctx.lineTo(-this.size - 10, 0);
        ctx.lineTo(-this.size, this.size/2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// Create rockets
let rockets = Array.from({ length: 25 }, () => new Rocket());
let particles = [];
let isAnimating = false;
let animationFrameId = null;

// Reset function
function resetAnimation() {
    if (!isAnimating) {
        rockets = Array.from({ length: 25 }, () => new Rocket());
        particles = [];
        // Clear canvas and redraw rockets immediately
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rockets.forEach(rocket => rocket.draw());
    }
}

// Start function
function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        animate();
    }
}

// Stop function
function stopAnimation() {
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
    }
}

// Add event listeners for buttons
document.getElementById('resetButton').addEventListener('click', resetAnimation);
document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('stopButton').addEventListener('click', stopAnimation);

// Animation loop
function animate() {
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw rockets
    rockets.forEach(rocket => {
        const hasCollided = rocket.update();
        if (hasCollided) {
            // Create particles on collision
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(rocket.x, rocket.y, rocket.color));
            }
        }
        rocket.draw();
    });

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        // Remove dead particles
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Check if all rockets are inactive
    if (rockets.every(rocket => !rocket.active) && particles.length === 0) {
        console.log('All rockets have crashed!');
        isAnimating = false;
        return;
    }

    animationFrameId = requestAnimationFrame(animate);
}

// Initial draw without animation
ctx.clearRect(0, 0, canvas.width, canvas.height);
rockets.forEach(rocket => rocket.draw()); 