document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 600;

    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const highScoreModal = document.getElementById('highScoreModal');
    const finalTimeEl = document.getElementById('finalTime');
    const playerNameInput = document.getElementById('playerName');
    const saveScoreBtn = document.getElementById('saveScoreBtn');
    const highScoreListEl = document.getElementById('highScoreList');
    const gameOverModal = document.getElementById('gameOverModal');
    const playAgainBtn = document.getElementById('playAgainBtn');

    const touchLeft = document.getElementById('touch-left');
    const touchRight = document.getElementById('touch-right');
    const touchShoot = document.getElementById('touch-shoot');

    const synth = new Tone.Synth().toDestination();
    const metalSynth = new Tone.MetalSynth().toDestination();
    const membraneSynth = new Tone.MembraneSynth().toDestination();

    function playLaserSound() {
        synth.triggerAttackRelease("C4", "8n");
    }

    function playExplosionSound() {
        metalSynth.triggerAttackRelease("C2", "8n");
    }

    function playAlienHitSound(alienType) {
        const notes = {
            '👾': 'E5',
            '👽': 'F5',
            '🛸': 'G5',
            '🤖': 'A5'
        };
        synth.triggerAttackRelease(notes[alienType] || "B5", "16n");
    }

    function playNextLevelSound() {
        const utterance = new SpeechSynthesisUtterance("Next Level");
        speechSynthesis.speak(utterance);
    }

    function playGameOverSound() {
        const utterance = new SpeechSynthesisUtterance("Game Over");
        speechSynthesis.speak(utterance);
    }

    function playNewHighScoreSound() {
        const utterance = new SpeechSynthesisUtterance("New High Score");
        speechSynthesis.speak(utterance);
    }

    let audioStarted = false;
    document.body.addEventListener('click', () => {
        if (!audioStarted) {
            Tone.start();
            audioStarted = true;
        }
    }, { once: true });

    let game = {
        paused: false,
        gameOver: false,
        score: 0,
        level: 1,
        startTime: Date.now(),
        endTime: null
    };

    const keys = {
        left: { pressed: false },
        right: { pressed: false },
        space: { pressed: false }
    };

    class Player {
        constructor() {
            this.width = 40;
            this.height = 40;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 10
            };
            this.velocity = { x: 0, y: 0 };
            this.speed = 5;
            this.emoji = '🚀';
        }

        draw() {
            ctx.font = `${this.height}px serif`;
            ctx.fillText(this.emoji, this.position.x, this.position.y + this.height);
        }

        update() {
            this.position.x += this.velocity.x;

            if (this.position.x < 0) {
                this.position.x = 0;
            } else if (this.position.x + this.width > canvas.width) {
                this.position.x = canvas.width - this.width;
            }

            this.draw();
        }
    }

    class Projectile {
        constructor({ position, velocity, emoji }) {
            this.position = position;
            this.velocity = velocity;
            this.width = 10;
            this.height = 20;
            this.emoji = emoji;
        }

        draw() {
            ctx.font = `20px serif`;
            ctx.fillText(this.emoji, this.position.x, this.position.y);
        }

        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
        }
    }

    class Alien {
        constructor({ position }) {
            this.position = position;
            this.width = 30;
            this.height = 30;
            const alienEmojis = ['👾', '👽', '🛸', '🤖'];
            this.emoji = alienEmojis[Math.floor(Math.random() * alienEmojis.length)];
        }

        draw() {
            ctx.font = `${this.height}px serif`;
            ctx.fillText(this.emoji, this.position.x, this.position.y + this.height);
        }

        update({ velocity }) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
            this.draw();
        }
    }

    class Grid {
        constructor() {
            this.position = { x: 0, y: 0 };
            this.velocity = { x: 3, y: 0 };
            this.aliens = [];

            const cols = Math.floor(Math.random() * 5) + 5;
            const rows = Math.floor(Math.random() * 3) + 2;
            this.width = cols * 40;

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    this.aliens.push(new Alien({
                        position: {
                            x: x * 40,
                            y: y * 40
                        }
                    }));
                }
            }
        }

        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.velocity.y = 0;

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x;
                this.velocity.y = 30;
            }
        }
    }

    class Particle {
        constructor({ position, velocity, emoji, fades }) {
            this.position = position;
            this.velocity = velocity;
            this.emoji = emoji;
            this.opacity = 1;
            this.fades = fades;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = `20px serif`;
            ctx.fillText(this.emoji, this.position.x, this.position.y);
            ctx.restore();
        }

        update() {
            if (this.fades) this.opacity -= 0.01;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
        }
    }

    let player = new Player();
    let projectiles = [];
    let grids = [new Grid()];
    let alienProjectiles = [];
    let particles = [];
    let stars = [];

    function createStars() {
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random()
            });
        }
    }

    function drawStars() {
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
    }

    function createParticles({ object, emoji, count = 15 }) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                emoji: emoji,
                fades: true
            }));
        }
    }

    function animate() {
        if (game.paused || game.gameOver) return;
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawStars();

        player.update();

        particles.forEach((particle, i) => {
            if (particle.opacity <= 0) {
                setTimeout(() => particles.splice(i, 1), 0);
            } else {
                particle.update();
            }
        });

        projectiles.forEach((projectile, index) => {
            if (projectile.position.y + projectile.height < 0) {
                setTimeout(() => projectiles.splice(index, 1), 0);
            } else {
                projectile.update();
            }
        });

        grids.forEach((grid, gridIndex) => {
            grid.update();

            // Alien shooting
            if (Math.random() < 0.01) {
                const randomAlien = grid.aliens[Math.floor(Math.random() * grid.aliens.length)];
                alienProjectiles.push(new Projectile({
                    position: {
                        x: randomAlien.position.x + grid.position.x + randomAlien.width / 2,
                        y: randomAlien.position.y + grid.position.y + randomAlien.height
                    },
                    velocity: { x: 0, y: 5 },
                    emoji: '💧'
                }));
            }

            grid.aliens.forEach((alien, i) => {
                alien.update({ velocity: grid.velocity });

                // Check if aliens reach the bottom
                if (alien.position.y + grid.position.y + alien.height >= canvas.height) {
                    endGame();
                }

                // Collision detection: projectile vs alien
                projectiles.forEach((projectile, j) => {
                    if (
                        projectile.position.y <= alien.position.y + grid.position.y + alien.height &&
                        projectile.position.y + projectile.height >= alien.position.y + grid.position.y &&
                        projectile.position.x + projectile.width >= alien.position.x + grid.position.x &&
                        projectile.position.x <= alien.position.x + grid.position.x + alien.width
                    ) {
                        setTimeout(() => {
                            const alienFound = grid.aliens.find(a => a === alien);
                            const projectileFound = projectiles.find(p => p === projectile);

                            if (alienFound && projectileFound) {
                                createParticles({ object: alien, emoji: '💥' });
                                playAlienHitSound(alien.emoji);
                                grid.aliens.splice(i, 1);
                                projectiles.splice(j, 1);
                                game.score += 100;
                                scoreEl.textContent = game.score;

                                if (grid.aliens.length > 0) {
                                    const firstAlien = grid.aliens[0];
                                    const lastAlien = grid.aliens[grid.aliens.length - 1];
                                    grid.width = (lastAlien.position.x - firstAlien.position.x) + lastAlien.width;
                                    grid.position.x = firstAlien.position.x;
                                } else {
                                    grids.splice(gridIndex, 1);
                                    game.level++;
                                    levelEl.textContent = game.level;
                                    playNextLevelSound();
                                    grids.push(new Grid());
                                }
                            }
                        }, 0);
                    }
                });
            });
        });

        alienProjectiles.forEach((alienProjectile, i) => {
            if (alienProjectile.position.y > canvas.height) {
                setTimeout(() => alienProjectiles.splice(i, 1), 0);
            } else {
                alienProjectile.update();
            }

            // Collision detection: alien projectile vs player
            if (
                alienProjectile.position.y + alienProjectile.height >= player.position.y &&
                alienProjectile.position.y <= player.position.y + player.height &&
                alienProjectile.position.x + alienProjectile.width >= player.position.x &&
                alienProjectile.position.x <= player.position.x + player.width
            ) {
                setTimeout(() => {
                    alienProjectiles.splice(i, 1);
                    createParticles({ object: player, emoji: '🔥' });
                    playExplosionSound();
                    endGame();
                }, 0);
            }
        });

        if (keys.left.pressed) {
            player.velocity.x = -player.speed;
        } else if (keys.right.pressed) {
            player.velocity.x = player.speed;
        } else {
            player.velocity.x = 0;
        }
    }

    function endGame() {
        game.gameOver = true;
        game.endTime = Date.now();
        const timeTaken = ((game.endTime - game.startTime) / 1000).toFixed(2);
        finalTimeEl.textContent = timeTaken;
        
        setTimeout(() => {
            const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            const lowestHighScore = highScores.length < 5 ? 0 : highScores[highScores.length - 1].score;

            if (game.score > 0 && game.score >= lowestHighScore) {
                playNewHighScoreSound();
                highScoreModal.style.display = 'block';
            } else {
                playGameOverSound();
                gameOverModal.style.display = 'block';
            }
        }, 1000);
    }

    function saveHighScore() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = {
            score: game.score,
            name: playerNameInput.value || 'Anonymous',
            time: ((game.endTime - game.startTime) / 1000).toFixed(2)
        };

        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(5); // Keep top 5

        localStorage.setItem('highScores', JSON.stringify(highScores));
        highScoreModal.style.display = 'none';
        gameOverModal.style.display = 'block';
        displayHighScores();
    }

    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScoreListEl.innerHTML = highScores
            .map(score => `<li>${score.name} - ${score.score} (Time: ${score.time}s)</li>`)
            .join('');
    }

    function resetGame() {
        player = new Player();
        projectiles = [];
        grids = [new Grid()];
        alienProjectiles = [];
        particles = [];
        game = {
            paused: false,
            gameOver: false,
            score: 0,
            level: 1,
            startTime: Date.now(),
            endTime: null
        };
        scoreEl.textContent = game.score;
        levelEl.textContent = game.level;
        gameOverModal.style.display = 'none';
        highScoreModal.style.display = 'none';
        animate();
    }

    playAgainBtn.addEventListener('click', resetGame);
    saveScoreBtn.addEventListener('click', saveHighScore);

    window.addEventListener('keydown', ({ key }) => {
        if (game.gameOver) return;

        switch (key) {
            case 'ArrowLeft':
                keys.left.pressed = true;
                break;
            case 'ArrowRight':
                keys.right.pressed = true;
                break;
            case ' ':
                if (!keys.space.pressed) {
                    playLaserSound();
                    projectiles.push(new Projectile({
                        position: {
                            x: player.position.x + player.width / 2 - 5,
                            y: player.position.y
                        },
                        velocity: { x: 0, y: -10 },
                        emoji: '💥'
                    }));
                    keys.space.pressed = true;
                }
                break;
            case 'p':
            case 'P':
                game.paused = !game.paused;
                if (!game.paused) {
                    animate();
                }
                break;
        }
    });

    window.addEventListener('keyup', ({ key }) => {
        switch (key) {
            case 'ArrowLeft':
                keys.left.pressed = false;
                break;
            case 'ArrowRight':
                keys.right.pressed = false;
                break;
            case ' ':
                keys.space.pressed = false;
                break;
        }
    });

    // Touch controls
    touchLeft.addEventListener('touchstart', () => keys.left.pressed = true);
    touchLeft.addEventListener('touchend', () => keys.left.pressed = false);
    touchRight.addEventListener('touchstart', () => keys.right.pressed = true);
    touchRight.addEventListener('touchend', () => keys.right.pressed = false);
    touchShoot.addEventListener('touchstart', () => {
        if (!keys.space.pressed) {
            playLaserSound();
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 5,
                    y: player.position.y
                },
                velocity: { x: 0, y: -10 },
                emoji: '💥'
            }));
            keys.space.pressed = true;
        }
    });
    touchShoot.addEventListener('touchend', () => keys.space.pressed = false);


    createStars();
    displayHighScores();
    animate();
});
