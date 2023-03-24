//EventEmitter for a pub/sub structure for events
class EventEmitter {
    // a constructor is necessary to initialize the store for events and callbacks
    constructor(){
        this.listeners = {};
    }
    //method that takes two arguments an then its fired
    on(message, listener) {
        //this if basically says that if the object listeners doesn't have the property,
        //it creates it and assigns it the empty array, after that, a new listener will be added to the array
        if (!this.listeners[message]) {
            this.listeners[message] = []
        }
        //then, if the property does exist, it just adds a listener
        this.listeners[message].push(listener);
    }
    //the emit method takes two arguments, no exceptions, the event's name, in this case "message" and a parameter, which must
    //be passed to a listener
    emit(message, payload = null) {
        if(this.listeners[message]) {
            //i think this basically says, for each listener, emit a message and a payload
            this.listeners[message].forEach((l) => l(message, payload))
        }
    }
}

class GameObject {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.dead = false;
      this.type = "";
      this.width = 0;
      this.height = 0;
      this.img = undefined;
    }
  
    draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    rectFromGameObject() {
      return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
      };
    }
  }

class Cat extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 64), (this.height = 64);
    this.type = "Cat";
    this.speed = { x: 0, y: 0 };
  }
}

class Atucha extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 64), (this.height = 64);
        this.type = "Atucha";
        this.speed = { x: 0, y: 0 }
    }
}

class Edesur extends GameObject {
    constructor(x, y) {
      super(x, y);
      (this.width = 200), (this.height = 200);
      this.type = "Edesur"; 
      this.speed = { x: 0, y: 0}
    }
}

//creates the cat var so it can be used as an object
let cat,
    eventEmitter = new EventEmitter();

//messages for the listeners to be passed on
const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    GAME_END_ATUCHA: "GAME_END_ATUCHA",
    ATUCHA_DOWN: "ATUCHA_DOWN",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
    EDESUR_DOWN: "EDESUR_DOWN",
    GAME_END_EDESUR: "GAME_END_EDESUR",
};

//eventlistener that listens for key presses, especially for arrow keys 
window.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } 
    else if (evt.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    }
    else if(evt.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
  });

function createCat() {
    cat = new Cat(
      512,
      704,
    );
    cat.img = catImg;
    gameObjects.push(cat);
  }

function createAtucha() {
    atucha = new Atucha(
      200,
      704,
    );
    atucha.img = atuchaImg;
    gameObjects.push(atucha);
}

function createEdesur() {
    edesur = new Edesur(
      700,
      704,
    );
    edesur.img = edesurImg;
    gameObjects.push(edesur);
}

//returns a fully loaded sound with the path passed as a str parameter
function createSound(path) {
    sound = new Audio();
    sound.src = path;
    return sound
};

//function that takes care of loading assets with a path passed as a str parameter
function loadAsset(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
};


function drawGameObjects(ctx) {
    gameObjects.forEach((go) => go.draw(ctx));
}

function intersectRect(r1, r2) {
	return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

function updateGameObjects() {

  const atuchaBody = gameObjects.filter((go) => go.type === 'Atucha');

  atuchaBody.forEach((atucha) => {
    const catBody = cat.rectFromGameObject();
    if (intersectRect(catBody, atucha.rectFromGameObject())){
      eventEmitter.emit(Messages.ATUCHA_DOWN);
    }
    else if (intersectRect(catBody, edesur.rectFromGameObject())){
      apagonSound.play()
      eventEmitter.emit(Messages.EDESUR_DOWN);
    }
  }
  )

}

function initGame() {
    gameObjects = [];
    createCat();
    createAtucha();
    createEdesur();

	eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
		cat.x -= 10;
	});

	eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
		cat.x += 10;
	});

  eventEmitter.on(Messages.ATUCHA_DOWN, () => {
    eventEmitter.emit(Messages.GAME_END_ATUCHA)
  });

  eventEmitter.on(Messages.EDESUR_DOWN, () => {
    displayMessage(
      "fuiste a hacer un reclado a edesur, no te respondió nadie"
    )
  });

  eventEmitter.on(Messages.GAME_END_ATUCHA, () => {
    if (boomAtucha === false) { 
      boomSound.play();
      boomAtucha = true;
    }
    endGame(atucha);
});

}

boomAtucha = false;

function isCatDead() {
  return cat.dead <= true;
}

function displayMessage(message, color = "black") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame() {
  if (atucha) {
    displayMessage(
      "explotó el atucha a la mierda"
    );
    apagonSound.pause();
  }
}

cronica = false;

//this defines the behaviour of everything once the page loads
window.onload = async () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    catImg = await loadAsset('assets/cat.png');
    atuchaImg = await loadAsset("assets/atucha.png");
    boomImg = await loadAsset("assets/boom.png");
    bgImg = await loadAsset("assets/bg.png");
    edesurImg = await loadAsset("assets/edesur.png");
    boomSound = createSound("assets/boomsound.mp3");
    apagonSound = createSound("assets/apagonSound.mp3");
    cronicaImg = await loadAsset("assets/test.png");


      
    //calling initgame function, basically creater the gameObjects array to later display objects,
    //and creates the objects themselves
    initGame();
	let gameLoopId = setInterval(() => {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0)
      updateGameObjects();
      drawGameObjects(ctx);
      if (boomAtucha === true) {
        ctx.drawImage(boomImg, 0, 370);
        setTimeout(function(){
          cronica = true;
        }, 3000)
        
      }
      if (cronica === true) {
          apagonSound.play();  
          ctx.drawImage(cronicaImg, 0, 0);
      }
	}, 25);

}