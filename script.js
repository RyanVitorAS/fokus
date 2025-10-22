// script.js - Timer Pomodoro com abas e controle start/pausar/reset
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // Abas
  const focoBt = document.querySelector('.app__card-button--foco');
  const curtoBt = document.querySelector('.app__card-button--curto');
  const longoBt = document.querySelector('.app__card-button--longo');
  const botoes = [focoBt, curtoBt, longoBt];

  // Timer + botões
  const timerEl = document.getElementById('timer');
  const startPauseBtn = document.getElementById('start-pause');
  const startPauseIcon = document.getElementById('start-pause-icon');
  const startPauseLabel = startPauseBtn.querySelector('span');
  const resetBtn = document.getElementById('reset');

  // Durações (em segundos)
  const duracoes = {
    'foco': 25 * 60,            // 25:00
    'descanso-curto': 1 * 60,   // 01:00
    'descanso-longo': 90 * 60   // 90:00
  };

  // Estado
  let contextoAtual = 'foco';
  let restante = duracoes[contextoAtual];
  let intervalo = null;
  let rodando = false;

  // Util
  const formatar = (seg) => {
    const m = Math.floor(seg / 60).toString().padStart(2, '0');
    const s = (seg % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const render = () => {
    timerEl.textContent = formatar(restante);
  };

  const trocarIcone = (estado) => {
    // Usa caminhos relativos para evitar problemas em GitHub Pages
    if (estado === 'play') {
      startPauseIcon.src = './imagens/play_arrow.png';
      startPauseIcon.alt = 'Começar';
      startPauseLabel.textContent = 'Começar';
    } else {
      startPauseIcon.src = './imagens/pause.png';
      startPauseIcon.alt = 'Pausar';
      startPauseLabel.textContent = 'Pausar';
    }
  };

  const pausar = () => {
    rodando = false;
    clearInterval(intervalo);
    intervalo = null;
    trocarIcone('play');
  };

  const tick = () => {
    if (restante > 0) {
      restante -= 1;
      render();
      return;
    }
    // terminou
    pausar();
    // Aqui você pode disparar um som ou notificação se desejar
  };

  const iniciar = () => {
    if (rodando) return;
    rodando = true;
    trocarIcone('pause');
    intervalo = setInterval(tick, 1000);
  };

  const setContexto = (novo) => {
    // Atualiza atributo no <html> para CSS temático
    html.setAttribute('data-contexto', novo);

    // Toggle visual das abas
    botoes.forEach(b => b.classList.remove('active'));
    if (novo === 'foco') focoBt.classList.add('active');
    if (novo === 'descanso-curto') curtoBt.classList.add('active');
    if (novo === 'descanso-longo') longoBt.classList.add('active');

    // Reset de timer para a nova duração
    pausar();
    contextoAtual = novo;
    restante = duracoes[novo];
    render();
  };

  const resetar = () => {
    pausar();
    restante = duracoes[contextoAtual];
    render();
  };

  // Eventos das abas
  focoBt.addEventListener('click', () => setContexto('foco'));
  curtoBt.addEventListener('click', () => setContexto('descanso-curto'));
  longoBt.addEventListener('click', () => setContexto('descanso-longo'));

  // Controles
  startPauseBtn.addEventListener('click', () => {
    if (rodando) pausar();
    else iniciar();
  });

  resetBtn.addEventListener('click', resetar);

  // Inicializa display
  render();
});
