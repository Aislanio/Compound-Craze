
//Banco de Palavras do User
let PalavrasCanva = [];
let PalavrasUser = [];

let isMouseDown = false;
let activeElement = null;
//Gerador de palavra

let iTime =0;
let i =500;

let ActiDown = null;
Loop();
//Load
let articleLoad = document.querySelector('.load');
let soundOn = true;

//Estado
finalFase = false;
//
let CombinationsUser = 0;
let wordCombinations =null;
let compoundAdjectives2 = null;
let ids = 0
//
let maxWords = 17;
//Time
let timer = null;
let isTimerRunning = false;
//
let contadorHtml = document.querySelector('#contador')
//Audio
var audio = new Audio("sound/sucess.wav");
var remove = new Audio("sound/remove.wav");
var jazz = new Audio("sound/jazz.mp3");
var click = new Audio("sound/click.mp3");
//divs
let CloneDiv = document.querySelector('.palavra');
let PaiPalavras = document.querySelector('.palavras');
//main
let Main = document.querySelector("main");
load();

//Vericar qual element ele está clicando 
function removeEventListeners() {
    PaiPalavras.querySelectorAll(".palavra").forEach(element => {
        element.removeEventListener("mousedown", handleMouseDown);
    });
}

function handleMouseDown(e) {
    if (isTimerRunning) {
        return;
    }
    let clone = e.currentTarget.cloneNode(true);
    isMouseDown = true;

    clone.classList.add("word");
    clone.setAttribute("data-posx", `${e.clientX - 100}`);
    clone.setAttribute("data-posy", `${e.clientY - 100}`);
    clone.setAttribute("data-id", `${1}`);
    
    clone.style.top = e.clientY + 'px';
    clone.style.left = e.clientX + 'px';

    Main.appendChild(clone);
    PalavrasCanva.push(clone);

    
    activeElement = clone;

    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mousemove', mouseMove);

    if (!isTimerRunning) {
        isTimerRunning = true;
        timer = setTimeout(() => {
            isTimerRunning = false;
        }, 1000);
    }
}

function AddEvent() {
    removeEventListeners(); // Remover listeners antigos
    PaiPalavras.querySelectorAll(".palavra").forEach(element => {
        element.addEventListener("mousedown", handleMouseDown);
    });
}
//


function mouseMove(e){
    if (!isMouseDown || !activeElement) return;

    // Pega as posições iniciais
    let DataPosx = activeElement.getAttribute("data-posx");
    let DataPosy = activeElement.getAttribute("data-posy");

    let Numx = Number(DataPosx);
    let Numy = Number(DataPosy);

    // Calcula as novas posições
    let posx = e.clientX - Numx;
    let posy = e.clientY - Numy;

    // Atualiza a posição do elemento
    activeElement.style.top = e.clientY + 'px';
    activeElement.style.left =  e.clientX + 'px';

    // Atualiza as coordenadas no elemento
    activeElement.setAttribute("data-posx", `${e.clientX - 100}` );
    activeElement.setAttribute("data-posy", `${e.clientY -100}`);
}

async function mouseUp(e){
    
    PalavrasCanva.forEach(elemnt=>{
        if(activeElement == null){
            return;
        }
        
        let IdElemnt = elemnt.getAttribute("data-posx");
        let IdActiveElement = activeElement.getAttribute("data-posx")

        if(IdElemnt != IdActiveElement){
            let colider = checkCollision(elemnt,activeElement);
            
            if(colider == true){
                ActiDown = elemnt;
                let bolPalavra =  compound(elemnt,activeElement);
                const indexToRemove = PalavrasCanva.findIndex(div => activeElement.getAttribute('data-id') === div.getAttribute('data-id'));
                PalavrasCanva.splice(indexToRemove, 1);
                if(bolPalavra){
                  activeElement.remove();
                }
                
            }else{

            }
        }
        
    });
    isMouseDown = false; // Reseta o estado do mouse
    activeElement = null; // Reseta o elemento ativo
    document.removeEventListener('mousemove', mouseMove)
}



function Loop(){
    PalavrasCanva.forEach(element => {
      
        element.addEventListener("mousedown",(e)=>{
            isMouseDown = true;
    
            
            element.classList.add("word");
            element.setAttribute("data-posx", `${e.clientX}`);
            element.setAttribute("data-posy", `${e.clientY}`);
            element.style.top = e.clientY + 'px';
            element.style.left =  e.clientX + 'px';
            
    
            activeElement = element;
            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('mousemove', mouseMove);
            
            
        })
    });

    
    

    requestAnimationFrame(Loop);
}



function checkCollision(div1, div2) {
  // Pega as dimensões e posição do primeiro elemento
  const rect1 = {
      x: div1.offsetLeft,
      y: div1.offsetTop,
      width: div1.offsetWidth,
      height: div1.offsetHeight
  };

  // Pega as dimensões e posição do segundo elemento
  const rect2 = {
      x: div2.offsetLeft,
      y: div2.offsetTop,
      width: div2.offsetWidth,
      height: div2.offsetHeight
  };

  // Verifica colisão usando as posições e dimensões (x, y, width, height)
  return !(
      rect1.x + rect1.width < rect2.x ||    // Div1 está à esquerda de Div2
      rect1.x > rect2.x + rect2.width ||    // Div1 está à direita de Div2
      rect1.y + rect1.height < rect2.y ||   // Div1 está acima de Div2
      rect1.y > rect2.y + rect2.height      // Div1 está abaixo de Div2
  );
}


function compound(Element1,Element2){
    {
        //Nome das palvras
        let Name1 = Element1.querySelector("p").innerHTML ;
        let Name2 = Element2.querySelector('p').innerHTML ;
        if(wordCombinations1 == null){
            return
        }
        
        for (const key in wordCombinations1) {
            if (wordCombinations1.hasOwnProperty(key)) {
                let nameCompt = key;
                
                if(Name1 == nameCompt){
                    let combinations = wordCombinations1[key];
                    
                    for (const combination of combinations){
                        let TypeCombis = combination.components
                        
                        for(const types of TypeCombis){
                          
                          //console.log(types.word2 +'///'+ Name1);
                          //console.log(types.word2 +'///'+ Name2);
                            if(types.word2 == Name2){
                              
                              let result = combinations.find(combo => 
                                    combo.components.some(component => component.word2 === types.word2));
                                  
                                  
                                  
                               NewPalavra(result.combination,result.emoji,true);
                               
                               PossCombinations();
                               PlaySound(1);
                               return true;
                            }
                        }
                    }
              }else if(Name2 == nameCompt){ 
                let combinations = wordCombinations1[key];
                    
                for (const combination of combinations){
                    let TypeCombis = combination.components
                    
                    for(const types of TypeCombis){
                      
                      //console.log(types.word2 +'///'+ Name1);
                      //console.log(types.word2 +'///'+ Name2);
                        if(types.word2 == Name1){
                          
                          let result = combinations.find(combo => 
                                combo.components.some(component => component.word2 === types.word2));
                              
                              
                              
                           NewPalavra(result.combination,result.emoji,true);
                           
                           PossCombinations();
                           PlaySound(1);
                           return true;
                        }
                    }
                }
              }
                
            }
        }
    }
    
}



//###############################COMBINATIONS  01########################################################
function load(){
  wordCombinations1 = {
    "Brush": [
      { 
        combination: "Toothbrush", 
        emoji: "🦷🪥", 
        components: [
          { word1: "Brush", emoji1: "🪥" },
          { word2: "Tooth", emoji2: "🦷" }
        ]
      },
      { 
        combination: "Hairbrush", 
        emoji: "💇‍♀️🪮", 
        components: [
          { word1: "Brush", emoji1: "🪮" },
          { word2: "Hair", emoji2: "💇‍♀️" }
        ]
      },
      { 
        combination: "Paintbrush", 
        emoji: "🎨🖌️", 
        components: [
          { word1: "Brush", emoji1: "🖌️" },
          { word2: "Paint", emoji2: "🎨" }
        ]
      },
      { 
        combination: "Bottlebrush", 
        emoji: "🍼🧹", 
        components: [
          { word1: "Brush", emoji1: "🧹" },
          { word2: "Bottle", emoji2: "🍼" }
        ]
      }
    ],
    "Bottle": [
      { 
        combination: "Bottlebrush", 
        emoji: "🍼🧹", 
        components: [
          { word1: "Bottle", emoji1: "🍼" },
          { word2: "Brush", emoji2: "🧹" }
        ]
      },
      { 
        combination: "Bottlecap", 
        emoji: "🍼🔝", 
        components: [
          { word1: "Bottle", emoji1: "🍼" },
          { word2: "Cap", emoji2: "🔝" }
        ]
      },
      { 
        combination: "Bottleneck", 
        emoji: "🍼🛑", 
        components: [
          { word1: "Bottle", emoji1: "🍼" },
          { word2: "Neck", emoji2: "🛑" }
        ]
      },
      { 
        combination: "Bottleship", 
        emoji: "🍼🚢", 
        components: [
          { word1: "Bottle", emoji1: "🍼" },
          { word2: "Ship", emoji2: "🚢" }
        ]
      }
    ],
    "Cap": [
      { 
        combination: "Capstone", 
        emoji: "🪙🔝", 
        components: [
          { word1: "Cap", emoji1: "🔝" },
          { word2: "Stone", emoji2: "🪙" }
        ]
      },
      { 
        combination: "Capsule", 
        emoji: "💊🔝", 
        components: [
          { word1: "Cap", emoji1: "🔝" },
          { word2: "Sule", emoji2: "💊" }
        ]
      },
      { 
        combination: "Capsize", 
        emoji: "🚤🔄", 
        components: [
          { word1: "Cap", emoji1: "🔝" },
          { word2: "Size", emoji2: "🔄" }
        ]
      },
      { 
        combination: "Bottlecap", 
        emoji: "🍼🔝", 
        components: [
          { word1: "Bottle", emoji1: "🍼" },
          { word2: "Cap", emoji2: "🔝" }
        ]
      }
    ],
    "Stone": [
      { 
        combination: "Headstone", 
        emoji: "⚰️🪙", 
        components: [
          { word1: "Stone", emoji1: "🪙" },
          { word2: "Head", emoji2: "⚰️" }
        ]
      },
      { 
        combination: "Steppingstone", 
        emoji: "🚶‍♂️🪙", 
        components: [
          { word1: "Stone", emoji1: "🪙" },
          { word2: "Stepping", emoji2: "🚶‍♂️" }
        ]
      },
      { 
        combination: "Gemstone", 
        emoji: "💎🪙", 
        components: [
          { word1: "Stone", emoji1: "🪙" },
          { word2: "Gem", emoji2: "💎" }
        ]
      },
      { 
        combination: "Sandstone", 
        emoji: "🏖️🪙", 
        components: [
          { word1: "Stone", emoji1: "🪙" },
          { word2: "Sand", emoji2: "🏖️" }
        ]
      }
    ],
    "Head": [
      { 
        combination: "Headphone", 
        emoji: "🎧🪙", 
        components: [
          { word1: "Head", emoji1: "🪙" },
          { word2: "Phone", emoji2: "🎧" }
        ]
      },
      { 
        combination: "Headband", 
        emoji: "🏷️🪙", 
        components: [
          { word1: "Head", emoji1: "🪙" },
          { word2: "Band", emoji2: "🏷️" }
        ]
      },
      { 
        combination: "Headrest", 
        emoji: "🛏️🪙", 
        components: [
          { word1: "Head", emoji1: "🪙" },
          { word2: "Rest", emoji2: "🛏️" }
        ]
      },
      { 
        combination: "Headstone", 
        emoji: "⚰️🪙", 
        components: [
          { word1: "Head", emoji1: "🪙" },
          { word2: "Stone", emoji2: "⚰️" }
        ]
      }
    ]
  };
  
   compoundAdjectives2 = {
    "Cold": [
      {
        combination: "Cold-hearted",
        emoji: "❄️❤️",
        components: [
          { word1: "Cold", emoji1: "❄️" },
          { word2: "Hearted", emoji2: "❤️" }
        ]
      },
      {
        combination: "Cold-blooded",
        emoji: "❄️🩸",
        components: [
          { word1: "Cold", emoji1: "❄️" },
          { word2: "Blooded", emoji2: "🩸" }
        ]
      }
    ],
    "Light": [
      {
        combination: "Light-hearted",
        emoji: "💡❤️",
        components: [
          { word1: "Light", emoji1: "💡" },
          { word2: "Hearted", emoji2: "❤️" }
        ]
      },
      {
        combination: "Light-footed",
        emoji: "💡👣",
        components: [
          { word1: "Light", emoji1: "💡" },
          { word2: "Footed", emoji2: "👣" }
        ]
      }
    ],
    "Red": [
      {
        combination: "Red-hot",
        emoji: "🔥❤️",
        components: [
          { word1: "Red", emoji1: "❤️" },
          { word2: "Hot", emoji2: "🔥" }
        ]
      },
      {
        combination: "Red-faced",
        emoji: "😳❤️",
        components: [
          { word1: "Red", emoji1: "❤️" },
          { word2: "Faced", emoji2: "😳" }
        ]
      }
    ],
    "Short": [
      {
        combination: "Short-sighted",
        emoji: "👓📏",
        components: [
          { word1: "Short", emoji1: "📏" },
          { word2: "Sighted", emoji2: "👓" }
        ]
      },
      {
        combination: "Short-tempered",
        emoji: "😠📏",
        components: [
          { word1: "Short", emoji1: "📏" },
          { word2: "Tempered", emoji2: "😠" }
        ]
      }
    ],
    "High": [
      {
        combination: "High-pitched",
        emoji: "📢⬆️",
        components: [
          { word1: "High", emoji1: "⬆️" },
          { word2: "Pitched", emoji2: "📢" }
        ]
      },
      {
        combination: "High-spirited",
        emoji: "🎉⬆️",
        components: [
          { word1: "High", emoji1: "⬆️" },
          { word2: "Spirited", emoji2: "🎉" }
        ]
      }
    ]
  };
      RemoveAll();
    //Set
    setTimeout(() => {
      articleLoad.remove();
    }, 4000);
      //Sons
      

      //Clone
      let clone = CloneDiv.cloneNode(true);
      CloneDiv.remove();
      let brushClone = clone.cloneNode(true);
        brushClone.querySelector('.emoji').textContent = '🪥';
        brushClone.querySelector('p').textContent = 'Brush';

        let bottleClone = clone.cloneNode(true);
        bottleClone.querySelector('.emoji').textContent = '🍼';
        bottleClone.querySelector('p').textContent = 'Bottle';

        PaiPalavras.appendChild(brushClone);
        PaiPalavras.appendChild(bottleClone);
        PalavrasUser.push(brushClone);
        PalavrasUser.push(bottleClone);

        AddEvent();
        
}

let remov = true;

function  NewPalavra(palavra,emoji,compound){

    let repNew = false;
    let Palavrasold = PaiPalavras.querySelectorAll('.palavra');
    Palavrasold.forEach(div =>{
         let name = div.querySelector('p').innerHTML;
         if(name == palavra){
            
            repNew = true
         }
    })

    if(repNew){
        return;
    }
    
    let CloneDiv = document.querySelector('.palavra');

    
     
    let brushClone = CloneDiv.cloneNode(true);
    brushClone.querySelector('.emoji').textContent = `${emoji}`;
    brushClone.querySelector('p').textContent =`${palavra}` ;
    if(compound){
      brushClone.classList.add("dourado")
    }

    PaiPalavras.appendChild(brushClone);
    PalavrasUser.push(brushClone);
    
    AddEvent();
    iTime =false
    i = 500
    generateNewWord();
    
      RemoveAll();
    
    remov = true;
    
}


function generateNewWord(){

  if(i == 500){
    iTime = false;
     AddPalavra();
    console.log('Generadonewword');
    i=0;
  }else{
    i++;
  }
       
  requestAnimationFrame(generateNewWord)
}


let bollean = true;
let PalavrasUsadas = [];

function AddPalavra(){
  let allWord2s = [];
  let allWor2Emoji = [];
 
  

  for (let key in wordCombinations1) {
    wordCombinations1[key].forEach((combinationObj) => {
      if (combinationObj.components && combinationObj.components[1]) {    
        // Alterna entre word1 e word2 baseado no booleano
        
          allWord2s.push(combinationObj.components[1].word2);
          allWor2Emoji.push(combinationObj.components[1].emoji2);
          
        
          allWord2s.push(combinationObj.components[0].word1);
          allWor2Emoji.push(combinationObj.components[0].emoji1);
          
         
          
        
      }
    });
  }
      
  
  // Alterna boleann para a próxima chamada

    

  // Função para pegar um word2 aleatório
  let randomIndex = null;
  function pickRandomWord() {
    randomIndex = Math.floor(Math.random() * allWord2s.length);
    return allWord2s[randomIndex];
  }

  


  

  
  // Escolhe um word2 aleatório e verifica se ele já existe na lista
  
  
  PalavrasUser.forEach((element) =>{
    let name = element.querySelector('p').innerHTML
    allWord2s.forEach((enent) =>{
      if(name === enent){
        let found = allWord2s.indexOf(name);
        //console.log(name +"="+ enent )
        //console.log(name === enent)
        allWord2s.splice(found, 1);
        allWor2Emoji.splice(found, 1);
      }
    })
  });

  
  
  let selectedWord = pickRandomWord();
  
  let palavras = 0
  let booleanPalavra = false;
  PalavrasUser.forEach(element => {
    let name = element.querySelector('p').innerHTML;
    if(name != selectedWord){
      palavras++;
    }else{
      booleanPalavra = true;
    }
  });
  if(palavras == PalavrasUser.length && booleanPalavra == false){
    if(selectedWord == 'undefined'){
      return;
    }
    PalavrasUsadas.push(selectedWord);
    NewPalavra(selectedWord,allWor2Emoji[randomIndex],false);

  }
  
  
 
 remov = false;
}


function RemoveAll(){
  let divs = document.querySelectorAll('.palavra');

  divs.forEach((e)=>{
    let id = e.getAttribute("data-id");
    if(id == 1){
      e.remove();
      PlaySound(2);
    }
  });

}

function PlaySound(e){
  if(e == 1){
    audio.volume = 0.1;
    audio.play();
    
  }
  if(e == 2){
    remove.volume = 0.6;
    remove.play();
  }
  if(e == 3){
  
    jazz.volume = 0.6;
    jazz.loop = true;

    jazz.play();
  }
  if(e == 4){
    click.volume = 0.6;
    click.play();
  }
}

//Sound jazz background 
document.addEventListener('click', function() {
  if(soundOn){
    PlaySound(3);
   
  }
  
});

let soundOffs = document.querySelector('#SoundOff');
let soundOns = document.querySelector('#SoundOn');
let Sounds = false
function SoundOff(e){

  if(!Sounds){
    jazz.currentTime = 0;
    jazz.pause();
    soundOn = false;
    Sounds = true
    
    soundOffs.style.display = "flex";
    soundOns.style.display = "none";
  }else{
    PlaySound(3);
    soundOffs.style.display = "none";
    soundOns.style.display = "flex";
    Sounds = false;
  }
  
  
}
let contadorUser = 0;


function PossCombinations(){
  CombinationsUser = 0;
  let Palavrasold = PaiPalavras.querySelectorAll('.palavra');
    Palavrasold.forEach(div =>{
      if(div.classList.contains('dourado')){
        CombinationsUser++;
        
      }
            
         
    });
    contadorHtml.innerHTML = `${maxWords} / ${CombinationsUser}`;
   

  if(CombinationsUser == maxWords){
    
    if(finalFase == false){
      console.log('Foi');
      load2pasher();
      confetes();
      finalFase = true
      let alert = document.querySelector('.alert')
      alert.style.display = "flex";
      document.querySelector('.alert_details p').innerHTML = "<strong>Congratulations</strong><br>You passed the first phase now the subject is <strong>Compound adjectives!</strong><br> When you close this alert, the game will <i>start</i> and so will the<i>time!</i>"
    }else{
      console.log('Final fase');
      window.location.href = 'congratulations.html';

    }
    
    
  }
}


function removeAlert(){
  PlaySound(4);
  document.querySelector('.alert').style.display = "none";

}





function load2pasher(){
  wordCombinations1= compoundAdjectives2;
  let Palavrasold = PaiPalavras.querySelectorAll('.palavra');
  //clone
      let clone = CloneDiv.cloneNode(true);
      CloneDiv.remove();
      let brushClone = clone.cloneNode(true);
        brushClone.querySelector('.emoji').textContent = '❄️';
        brushClone.querySelector('p').textContent = 'Cold';

        let bottleClone = clone.cloneNode(true);
        bottleClone.querySelector('.emoji').textContent = '❤️';
        bottleClone.querySelector('p').textContent = 'Hearted';

       

    Palavrasold.forEach(div =>{
      div.remove();
            
         
    });
    CombinationsUser = 0
    maxWords = 10
    PossCombinations()
    PaiPalavras.appendChild(brushClone);
        PaiPalavras.appendChild(bottleClone);
        PalavrasUser.push(brushClone);
        PalavrasUser.push(bottleClone);
}

//Confetes

function confetes(){
  let params = {
		particleCount: 500, // Quantidade de confetes
		spread: 90, // O quanto eles se espalham
		startVelocity: 70, // Velocidade inicial
		origin: { x: 0, y: 0.5 }, // Posição inicial na tela
		angle: 45 // Ângulo em que os confetes serão lançados
	};

	// Joga confetes da esquerda pra direita
	confetti(params);

	// Joga confetes da direita para a esquerda
	params.origin.x = 1;
	params.angle = 135;
	confetti(params);
}

