// Variável para rastrear o número de resultados
let resultadoCount = 1;

// Armazena os últimos valores de input para sortear novamente
let ultimosValores = {
  quantidade: 0,
  minimo: 0,
  maximo: 0,
  naoRepetir: false
};

// Seleciona os elementos do DOM
const inputNUM = document.getElementById('inputNUM');
const inputDE = document.getElementById('inputDE');
const inputATE = document.getElementById('inputATE');
const checkboxRepeat = document.getElementById('repeat');
const sections = document.querySelectorAll('.right-section');
const formSection = sections[0];
const resultSection = sections[1];

// Botões
const btnSortear = formSection.querySelector('.btn');
const btnSortearNovamente = resultSection.querySelector('.btn');

// Adiciona eventos aos botões
btnSortear.addEventListener('click', sortear);
btnSortearNovamente.addEventListener('click', sortearNovamente);

function sortear() {
  // Pega os valores dos inputs
  const quantidade = inputNUM.value.trim();
  const minimo = inputDE.value.trim();
  const maximo = inputATE.value.trim();
  const naoRepetir = checkboxRepeat.checked;

  // Validação 1: Não permitir campos vazios
  if (!quantidade || !minimo || !maximo) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Converte para números
  const qtd = parseInt(quantidade);
  const min = parseInt(minimo);
  const max = parseInt(maximo);

  // Valida se são números válidos
  if (isNaN(qtd) || isNaN(min) || isNaN(max)) {
    alert('Por favor, insira apenas números válidos!');
    return;
  }

  // Validação 2: O valor máximo deve ser maior que o valor mínimo
  if (max <= min) {
    alert('O valor máximo deve ser maior que o valor mínimo!');
    return;
  }

  // Validação 3: A quantidade de números não pode ser maior que o intervalo disponível
  const intervalo = max - min + 1;
  if (naoRepetir && qtd > intervalo) {
    alert(`A quantidade de números não pode ser maior que o intervalo disponível (${intervalo} números). Desmarque a opção "Não repetir número" ou ajuste os valores.`);
    return;
  }

  // Valida quantidade positiva
  if (qtd <= 0) {
    alert('A quantidade de números deve ser maior que zero!');
    return;
  }

  // Armazena os últimos valores para sortear novamente
  ultimosValores = {
    quantidade: qtd,
    minimo: min,
    maximo: max,
    naoRepetir: naoRepetir
  };

  // Realiza o sorteio
  const numerosSorteados = realizarSorteio(qtd, min, max, naoRepetir);

  // Exibe os resultados
  exibirResultados(numerosSorteados);
}

function sortearNovamente() {
  // Incrementa o contador de resultado
  resultadoCount++;

  // Realiza um novo sorteio com os mesmos parâmetros
  const numerosSorteados = realizarSorteio(
    ultimosValores.quantidade,
    ultimosValores.minimo,
    ultimosValores.maximo,
    ultimosValores.naoRepetir
  );

  // Exibe os resultados
  exibirResultados(numerosSorteados);
}

function realizarSorteio(quantidade, minimo, maximo, naoRepetir) {
  const numeros = [];

  if (naoRepetir) {
    // Sorteio sem repetição
    const numerosDisponiveis = [];
    for (let i = minimo; i <= maximo; i++) {
      numerosDisponiveis.push(i);
    }

    for (let i = 0; i < quantidade; i++) {
      const indiceAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
      numeros.push(numerosDisponiveis[indiceAleatorio]);
      numerosDisponiveis.splice(indiceAleatorio, 1);
    }
  } else {
    // Sorteio com repetição
    for (let i = 0; i < quantidade; i++) {
      const numeroAleatorio = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
      numeros.push(numeroAleatorio);
    }
  }

  return numeros;
}

function exibirResultados(numeros) {
  // Seleciona a div de resultados
  const resultsDiv = resultSection.querySelector('.results');
  const btnContainer = resultSection.querySelector('.flex.gap-1');

  // Limpa os resultados anteriores
  resultsDiv.innerHTML = '';

  // Esconde o botão inicialmente
  btnContainer.style.opacity = '0';
  btnContainer.style.visibility = 'hidden';

  // Atualiza o contador de resultado
  const tituloResultado = resultSection.querySelector('.title p:last-child');
  tituloResultado.textContent = `${resultadoCount}º RESULTADO`;

  // Esconde o formulário e mostra a seção de resultados expandida
  formSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  resultSection.style.flex = '1';

  // Adiciona cada número sorteado com animação
  numeros.forEach((numero, index) => {
    setTimeout(() => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item animating';
      
      const resultBox = document.createElement('div');
      resultBox.className = 'result-box';
      
      const span = document.createElement('span');
      span.textContent = numero;
      
      resultBox.appendChild(span);
      resultItem.appendChild(resultBox);
      resultsDiv.appendChild(resultItem);

      // Mostrar o número aos 72º (40% da animação = 600ms)
      setTimeout(() => {
        span.style.opacity = '1';
      }, 600);

      // Após a animação completa (1.5s), remover classe animating e adicionar revealed
      setTimeout(() => {
        resultItem.classList.remove('animating');
        resultItem.classList.add('revealed');
        
        // Se é o último número, mostra o botão após a animação
        if (index === numeros.length - 1) {
          btnContainer.style.transition = 'opacity 0.5s ease-in';
          btnContainer.style.opacity = '1';
          btnContainer.style.visibility = 'visible';
        }
      }, 1500);

    }, index * 1500); // Espera 1.5 segundo entre cada número
  });
}

