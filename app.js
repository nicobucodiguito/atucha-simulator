endGame = false


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

let cat,
    eventEmitter = new EventEmitter();

//messages for the listeners to be passed on
const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};

//eventlistener that listens for key presses, especially for arrow keys 
window.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);

    } else if (evt.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
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
      ctx.drawImage(boomImg, 0, 370);
      function alertas() {
        window.alert("nooo gatito que hiciste");
        window.alert("exploto todo a la mierda y se quedo sin luz la mitad del pais");
        window.alert(":(");
      };
      setTimeout(() =>
      alertas()
      , 300)
    }
  }
  )
}

function initGame() {
    gameObjects = [];
    createCat();
    createAtucha();

	eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
		cat.x -= 10;
	});

	eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
		cat.x += 10;
	});
}

//this defines the behaviour of everything once the page loads
window.onload = async () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    catImg = await loadAsset('assets/cat.png');
    atuchaImg = await loadAsset("assets/atucha.png");
    boomImg = await loadAsset("assets/boom.png");
    bgImg = await loadAsset("assets/bg.png");
    
    //calling initgame function, basically creater the gameObjects array to later display objects,
    //and creates the objects themselves
    initGame();
	let gameLoopId = setInterval(() => {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0)
      updateGameObjects();
      drawGameObjects(ctx);
	}, 25);

}