let data; // Variável para armazenar os dados do CSV
let continentsData = []; // Array que irá armazenar os rios agrupados por continente

function preload() {
  // Carrega o arquivo CSV contendo os dados dos rios
  data = loadTable('assets/Rivers.csv', 'csv', 'header');
}

function setup() {
  // Chama a função para extrair os dados agrupados por continente
  extractContinentsData();
  
  // Calcula a altura exata do canvas com base no conteúdo
  let canvasHeight = calculateCanvasHeight(); 
  
  // Cria o canvas com a largura da tela e altura exata
  createCanvas(windowWidth, canvasHeight); 
  background(255);
  
  // Exibe os rios agrupados por continente com layout vertical
  displayRiversList();
}

function calculateCanvasHeight() {
  let yOffset = 0; // Variável para acumular a posição vertical do conteúdo
  let heightPerContinent = 150;  // Distância que cada continente ocupa (ajustável)
  let heightPerRiver = 30;      // Distância entre as bolas dos rios
  let spaceBetweenContinents = 50; // Distância entre os continentes
  
  // Calcula a altura total necessária com base no conteúdo
  for (let i = 0; i < continentsData.length; i++) {
    let continentData = continentsData[i];

    yOffset += 30;  // Distância para o nome do continente
    
    let yOffsetRivers = yOffset; // Posição inicial para os rios
    for (let j = 0; j < continentData.rivers.length; j++) {
      yOffsetRivers += heightPerRiver; // Distância entre as bolas dos rios
    }
    
    let yOffsetOutflows = yOffset; // Posição inicial para os outflows
    for (let j = 0; j < continentData.rivers.length; j++) {
      yOffsetOutflows += heightPerRiver;  // Distância entre as bolas dos outflows
    }

    // A altura total do continente é a maior das duas: rios ou outflows
    let continentHeight = Math.max(yOffsetRivers, yOffsetOutflows) - yOffset;
    
    // Atualiza a posição para o próximo continente
    yOffset += continentHeight + spaceBetweenContinents;
  }

  // Retorna a altura exata necessária para o conteúdo
  return yOffset; 
}

function extractContinentsData() {
  let continentNames = data.getColumn("continent");
  let riverNames = data.getColumn("name");
  let outflows = data.getColumn("outflow");

  let continents = {};

  for (let i = 0; i < data.getRowCount(); i++) {
    let continent = continentNames[i]; // Nome do continente
    let outflow = outflows[i]; // Local de deságue do rio

    // Verifica se o continente é "Australia" e corrige para "Oceania"
    if (continent === "Australia") {
      continent = "Oceania"; // Substitui "Australia" por "Oceania"
    }

    if (!continents[continent]) {
      continents[continent] = []; // Se não existir, cria um array para os rios deste continente
    }

    // Adiciona o nome do rio e o outflow correspondente à lista do continente
    continents[continent].push({ outflow });
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
  let leftOffset = 25; // Deslocando as bolas de rios para a direita
  let rightOffset = width - 150; // Posição inicial para as bolas de outflows (lado direito)
  let yOffset = 0; // Distância inicial para o primeiro continente
  
  // Calcular o tamanho das bolas com base no número de rios e o tamanho da tela
  let ballDiameter = Math.max(10, windowHeight / 100); // Garantir que o diâmetro não seja muito pequeno
  
  let spaceBetweenContinents = 50;  // Distância entre os continentes
  
  for (let i = 0; i < continentsData.length; i++) {
    let continentData = continentsData[i];

    yOffset += 30; // Distância entre o nome do continente e as bolas dos rios
    
    let riverOffsets = []; // Array para armazenar a posição de cada bola de rio
    let riverOutflows = []; // Array para armazenar os outflows correspondentes
    
    let yOffsetRivers = yOffset; // Posição vertical para os rios
    
    // Exibe as bolas dos rios no lado esquerdo
    fill(50); // Cor cinza para os rios
    noStroke();
    
    for (let j = 0; j < continentData.rivers.length; j++) {
      let river = continentData.rivers[j];
      
      // Desenha um círculo para cada rio
      ellipse(leftOffset, yOffsetRivers, ballDiameter, ballDiameter);
      riverOffsets.push({ x: leftOffset, y: yOffsetRivers, riverName: river.riverName });
      riverOutflows.push(river.outflow);
      yOffsetRivers += ballDiameter + 15; // Distância entre as bolas dos rios
    }
    
    let yOffsetOutflows = yOffset; // Posição vertical para os outflows
    let outflowsData = [];  // Array para armazenar os outflows e suas posições
    
    for (let j = 0; j < continentData.rivers.length; j++) {
      let river = continentData.rivers[j];
      let outflow = river.outflow;

      // Verifica se o outflow já foi registrado
      let outflowExists = outflowsData.find((data) => data.outflow === outflow);
      if (!outflowExists) {
        // Adiciona o outflow e sua posição
        outflowsData.push({ outflow: outflow, yPosition: yOffsetOutflows });
        
        // Desenha a bola de outflow
        fill(150, 50, 50); // Cor vermelha para o outflow
        ellipse(rightOffset, yOffsetOutflows, ballDiameter, ballDiameter);
        
        // Desenha o nome do outflow à direita da bola com espaçamento
        fill(0);  // Cor preta para o nome do outflow
        textSize(12);  // Tamanho do texto
        textAlign(LEFT, CENTER);  // Alinha o texto à esquerda da bola de outflow
        text(outflow, rightOffset + ballDiameter + 10, yOffsetOutflows);
        
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
        stroke(100);
        line(river.x, river.y, outflowPos.x, outflowPos.y);
      }
    }

    // Calcula a altura do continente com base nos rios e outflows
    let continentHeight = Math.max(yOffsetRivers, yOffsetOutflows) - yOffset;
    
    // Atualiza a posição do próximo continente
    yOffset += continentHeight + spaceBetweenContinents;
  }
}

function windowResized() {
  // Recalcula a altura do canvas quando a janela for redimensionada
  let canvasHeight = calculateCanvasHeight();
  resizeCanvas(windowWidth, canvasHeight);  // Ajusta o canvas
  background(255);  // Limpa a tela para redesenhar
  displayRiversList();  // Redesenha os rios
}
