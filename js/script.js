let move_speed = 3, gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById('bird-1');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
let bird_dy = 0; // Velocidade do movimento do pássaro

img.style.display = 'none';
message.classList.add('messageStyle');

// Iniciar o jogo ao pressionar "Enter"
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state !== "Play") {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });

        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score: ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

// Função principal de jogo
function play() {

    // Função para mover os pipes
    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            let bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br> Pressione Enter para Recomeçar';
                    message.classList.add('messageStyle');
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.getAttribute("increase_score") === "1") {
                        score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }

    requestAnimationFrame(move);

    // Função de aplicar a gravidade
    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity; // A gravidade aumenta com o tempo

        bird_props = bird.getBoundingClientRect();

        // Verifica se o pássaro está fora dos limites da tela
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        requestAnimationFrame(apply_gravity);
    }

    requestAnimationFrame(apply_gravity);

    // Função para criar pipes
    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = (pipe_posi - 70) + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = (pipe_posi + pipe_gap) + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.setAttribute("increase_score", "1");

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(create_pipe);
}

// Controle do movimento do pássaro com teclas
let isKeyDown = false;  // Impede que a tecla seja processada novamente enquanto pressionada

document.addEventListener('keydown', (e) => {
    // Verifica se a tecla pressionada é a seta para cima ou a barra de espaço
    if ((e.key == 'ArrowUp' || e.key == ' ') && !isKeyDown) {
        isKeyDown = true;  // Impede múltiplos eventos enquanto a tecla estiver pressionada
        img.src = 'img/Bird-2.png'; // Imagem do pássaro subindo
        bird_dy = -7.6; // Defina a aceleração para subir
    }
});

// Libera a tecla quando for solta
document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowUp' || e.key == ' ') {
        isKeyDown = false;  // Libera a tecla
        img.src = 'img/Bird.png'; // Volta para a imagem normal do pássaro
    }
});
