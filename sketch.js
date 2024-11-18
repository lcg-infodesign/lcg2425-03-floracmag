let data; // Variável para armazenar os dados do CSV
let continentsData = []; // Array que irá armazenar os rios agrupados por continente

function preload() {
  // Carrega o arquivo CSV contendo os dados dos rios
  data = loadTable('assets/Rivers.csv', 'csv', 'header');
}

function setup() {
  // Chama a função para extrair os dados agrupados por continente
  extractContinentsData();
  
  // Define o tamanho do canvas. Usamos windowWidth para a largura e uma altura calculada dinamicamente.
  let canvasHeight = calculateCanvasHeight();  // Calcula a altura necessária para o conteúdo
  
  createCanvas(windowWidth, canvasHeight);  // Largura total da tela, altura ajustada
  background("black");
  
  // Exibe os rios agrupados por continente com layout vertical
  displayRiversList();
  
  // Ajusta a rolagem para que só ocorra quando o conteúdo ultrapassar a altura da janela
  if (canvasHeight > windowHeight) {
    document.body.style.overflowY = "scroll";  // Ativa o scroll vertical
  } else {
    document.body.style.overflowY = "hidden";  // Desativa o scroll se o conteúdo couber na tela
  }
}

function calculateCanvasHeight() {
  // Calcula a altura do canvas com base no número de continentes e rios
  let numContinents = continentsData.length;
  let numRivers = continentsData.reduce((acc, continent) => acc + continent.rivers.length, 0);
  let heightPerContinent = 150;  // Distância que cada continente ocupa (ajustável)
  let heightPerRiver = 30;      // Distância entre as bolas dos rios
  
  // Calculando altura necessária para o canvas
  // Aqui somamos a altura necessária para os continentes, rios e outflows
  let totalHeight = numContinents * heightPerContinent + numRivers * heightPerRiver + 200; // A soma do conteúdo
  
  return totalHeight;  // Retorna a altura total calculada
}

function extractContinentsData() {
  let continentNames = data.getColumn("continent");
  let riverNames = data.getColumn("name");
  let outflows = data.getColumn("outflow");

  // Vamos armazenar os rios agrupados por continente
  let continents = {};

  // Itera sobre cada linha dos dados para agrupar os rios por continente
  for (let i = 0; i < data.getRowCount(); i++) {
    let continent = continentNames[i]; // Nome do continente
    let outflow = outflows[i]; // Local de deságue do rio

    // Verifica se o continente é "Australia" e corrige para "Oceania"
    if (continent === "Australia") {
      continent = "Oceania"; // Substitui "Australia" por "Oceania"
    }

    // Verifica se o continente já existe no objeto "continents"
    if (!continents[continent]) {
      continents[continent] = []; // Se não existir, cria um array para os rios deste continente
    }

    // Adiciona o nome do rio e o outflow correspondente à lista do continente
    continents[continent].push({ riverName: riverNames[i], outflow });
  }

  // Converte o objeto "continents" para um array de objetos
  for (let continent in continents) {
    continentsData.push({
      continent: continent,
      rivers: continents[continent]
    });
  }
}

function displayRiversList() {
  let leftOffset = 50; // Deslocando as bolas de rios para a direita
  let rightOffset = width - 150; // Posição inicial para as bolas de outflows (lado direito)
  let yOffset = continentsData.length; // Distância inicial para o primeiro continente
  
  // Calcular o tamanho das bolas com base no número de rios e o tamanho da tela
  let ballDiameter = Math.max(10, windowHeight / 200); // Garantir que o diâmetro não seja muito pequeno
  
  // Define a distância entre os continentes (ajustável)
  let spaceBetweenContinents = 50;  // Ajuste a distância entre os continentes aqui
  
  // Exibe os rios agrupados por continente
  for (let i = 0; i < continentsData.length; i++) {
    let continentData = continentsData[i];

// Desenha o nome do continente à esquerda das bolas de rios
push();  // Inicia um novo contexto de transformação
translate(25, yOffset + 28);  // Move a origem para o ponto de partida desejado (ajustado)
rotate(-PI / 2);  // Rotaciona o texto em -90 graus (anti-horário)

// Alinha o texto à direita (final da palavra)
textAlign(RIGHT, CENTER);  // Alinha o texto ao final, ou seja, à direita

fill("yellow");  // Cor do texto
noStroke()
textSize(12);  // Tamanho da fonte

// Desenha o nome do continente, já rotacionado e alinhado à direita
text(continentData.continent, 0, 0);  

pop();  // Restaura as transformações anteriores
    
    yOffset += 30; // Distância entre o nome do continente e as bolas dos rios
    
    let riverOffsets = []; // Array para armazenar a posição de cada bola de rio
    let riverOutflows = []; // Array para armazenar os outflows correspondentes
    
    let yOffsetRivers = yOffset; // Posição vertical para os rios
    
    // Exibe as bolas dos rios no lado esquerdo
    fill("blue"); // Cor das bolas dos rios
    noStroke();
    
    for (let j = 0; j < continentData.rivers.length; j++) {
      let river = continentData.rivers[j];
      
      // Desenha um círculo para cada rio
      ellipse(leftOffset, yOffsetRivers, ballDiameter, ballDiameter);
      riverOffsets.push({ x: leftOffset, y: yOffsetRivers, riverName: river.riverName }); // Salva a posição da bola e o nome do rio
      riverOutflows.push(river.outflow); // Salva o outflow correspondente
      yOffsetRivers += ballDiameter + 15; // Distância entre as bolas dos rios
    }
    
    let yOffsetOutflows = yOffset; // Posição vertical para os outflows
    
    // Exibe as bolas de outflows no lado direito
    let outflowsData = [];  // Array para armazenar os outflows e suas posições
    
    for (let j = 0; j < continentData.rivers.length; j++) {
      let river = continentData.rivers[j];
      let outflow = river.outflow;

      // Verifica se o outflow já foi registrado
      let outflowExists = outflowsData.find((data) => data.outflow === outflow);
      if (!outflowExists) {
        // Adiciona o outflow e sua posição
        outflowsData.push({ outflow: outflow, yPosition: yOffsetOutflows });
        
        // Define a cor vermelha para as bolas de outflow
        fill("red"); // Cor vermelha para o outflow
        
        // Desenha a bola de outflow
        ellipse(rightOffset, yOffsetOutflows, ballDiameter, ballDiameter);
        
        // Desenha o nome do outflow à direita da bola com espaçamento
        fill("yellow");  // Cor preta para o nome do outflow
        textSize(12);  // Tamanho do texto
        
        textAlign(LEFT, CENTER);  // Alinha o texto à esquerda da bola de outflow
        text(outflow, rightOffset + ballDiameter + 10, yOffsetOutflows); // Desenha o nome do outflow com espaço da bola
        
        yOffsetOutflows += ballDiameter + 15; // Distância entre as bolas dos outflows
      }
    }

    // Agora desenha linhas conectando cada rio ao seu outflow
    for (let j = 0; j < riverOffsets.length; j++) {
      let river = riverOffsets[j];
      let outflow = riverOutflows[j];

      // Encontrar a posição da bola correspondente ao outflow
      let outflowData = outflowsData.find((data) => data.outflow === outflow);
      if (outflowData) {
        let outflowPos = { x: rightOffset, y: outflowData.yPosition };

        // Desenha a linha conectando o rio ao outflow
        stroke("blue");  // Cor da linha
        line(river.x, river.y, outflowPos.x, outflowPos.y);  // Desenha a linha
      }
    }

    // Calcular a altura total do continente (o maior entre rios e outflows)
    let continentHeight = Math.max(yOffsetRivers, yOffsetOutflows) - yOffset - 80;  // Ajuste a altura total
    
    // Atualiza a posição do próximo continente com a distância regular entre os continentes
    yOffset += continentHeight + spaceBetweenContinents;  // A distância entre continentes agora pode ser ajustada aqui
  }
}

function windowResized() {
  let canvasHeight = calculateCanvasHeight();  // Recalcula a altura do canvas
  resizeCanvas(windowWidth, canvasHeight);  // Redimensiona o canvas para a nova altura
  background("black");  // Limpa a tela para redesenhar
  displayRiversList();  // Redesenha os rios com a nova altura
  
  // Ajusta a rolagem para que só ocorra quando o conteúdo ultrapassar a altura da janela
  if (canvasHeight > windowHeight) {
    document.body.style.overflowY = "scroll";  // Ativa o scroll vertical
  } else {
    document.body.style.overflowY = "hidden";  // Desativa o scroll se o conteúdo couber na tela
  }
}
