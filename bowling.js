class Player{
  constructor(name) {
    this.name = name;
    this.frames = [];
    this.totalScore = 0;
    this.strikeBonus = 0;
    this.spareBonus = 0;
    this.round = 1;
    this.throws = 2;
    this.previousRoll = 0;
    this.silotape = 0;
  };

  gameOver(){
    if(this.round == 12){
      this.switchPlayer()
      Game.playersDone++
    }
    else if(this.round == 11 && this.frames[this.frames.length - 2].reduce((total, amount) => total + amount) < 10){
      this.switchPlayer()
      Game.playersDone++ 
    }
  }

  rules(roll){
    console.log(`Rules function(): the value of roll:${roll}`);
    console.log(`Rules function(): the Typeof of roll:${typeof roll}`);
    let i;
    let sum = 0, currentframe = 0;
    if(roll || roll == 0){
      console.log(`Rules function()2: the value of roll:${roll}`);
      this.throws--
      if(this.frames.length == 0){
        this.frames.push([]);
        console.log('created new 1st frame');
      }
      if(this.frames.length == 1 && this.frames[0].length < 2 && this.silotape != 10){
          if(roll == 10){
            this.frames[this.frames.length - 1].push(roll);
            this.totalScore += roll
            this.silotape = 10;
            this.throws = 2;
            this.switchPlayer()
            this.round++
          }
          else if(roll < 10){
            if(this.frames[this.frames.length - 1].length == 0){
              this.frames[this.frames.length - 1].push(roll);
              this.totalScore += roll
              this.previousRoll = roll;
            }
            else if(this.frames[this.frames.length - 1].length > 0){
              this.frames[this.frames.length - 1].push(roll);
              this.totalScore += roll
              this.throws = 2;
              this.switchPlayer()
              this.round++
            };
          };
      }
      else if(this.frames.length > 0){
        if(this.frames[this.frames.length - 1].length <= 2 && this.frames[this.frames.length - 1][0] == 10 || this.frames[this.frames.length - 1].length == 2/*typeof  this.frames[this.frames.length] == "undefined"*/ /*&& this.frames[this.frames.length - 1].length != 0*/){
          this.frames.push([]);
          console.log('created new frame');
        }
        sum = this.frames[this.frames.length - 2].reduce((total, amount) => total + amount)
        console.log(`the value of sum is ${sum}`);
        if(this.frames[this.frames.length - 1].length == 0){
          this.frames[this.frames.length - 2].forEach(element =>{
            element == 10 || sum == 10 ? this.totalScore += roll : null; 
          })
          if(roll == 10){
            console.log(`value of 1st roll is ${roll}`)
            this.frames[this.frames.length - 1].push(roll)
            this.totalScore += roll
            this.throws = 2;
            this.switchPlayer()
            this.round++
            if(this.frames.length == 10){
              this.strikeBonus++
              this.switchPlayer();
              this.switchPlayer();
            };
          }
          else{
            console.log(`value of 1st roll is ${roll}`)
            this.frames[this.frames.length - 1].push(roll)
            this.totalScore += roll
            this.previousRoll = roll;
          }
          if(this.frames.length == 11 && this.strikeBonus == 1){
            this.switchPlayer();
            this.switchPlayer();
          }
        }
        else if(this.frames[this.frames.length - 1].length > 0){
          this.frames[this.frames.length - 2].forEach(element =>{
            element == 10 ? this.totalScore += roll : null; 
          })
          console.log(`value of 2nd roll is ${roll}`);
          this.totalScore += roll
          this.frames[this.frames.length - 1].push(roll);
          this.throws = 2;
          this.previousRoll = roll;
          this.switchPlayer();
          this.round++
          for(let i = 0; i < this.frames[this.frames.length -1].length; i++){
            currentframe += this.frames[this.frames.length - 1][i]
          };
          if(this.frames.length == 10 && this.frames[this.frames.length - 1].reduce((total, amount) => total + amount) == 10){
              this.spareBonus++
              this.switchPlayer();
              this.switchPlayer();
          };
          console.log('we just switched players');
        };
      };
    };

  };

  switchPlayer(arr){
    const howManyPlayers = Game.allPlayers.length;
    if(howManyPlayers > 1){
      Game.allPlayers.unshift(Game.allPlayers[howManyPlayers - 1]);
      Game.allPlayers.pop();

    };
    if(Game.allPlayers[0]){
      console.log(`${Game.allPlayers[0].name} is playing now`);
      if(Game.allPlayers[Game.allPlayers.length - 1]){
        console.log(`${Game.allPlayers[Game.allPlayers.length - 1].name} is playing next`);
      }
    }
  };
};

class Game{
  constructor(){
    Game.allPlayers = [];
    Game.isUISet = false;
    Game.playersDone = 0;
    Game.leaderboard = ()=>{
      let displayScore;
      let frameScores = "";
      for(let i = 0; i < Game.allPlayers.length; i++){
        if(!document.getElementById(Game.allPlayers[i].name)){
          displayScore = document.createElement("h4");
          displayScore.setAttribute("id", Game.allPlayers[i].name);
          displayScore.setAttribute("class", "headerTag");
          displayScore.setAttribute("data-score", Game.allPlayers[i].totalScore);
          document.getElementById("leaderboard").appendChild(displayScore);
        };
        if(document.getElementById(Game.allPlayers[i].name)){
          document.getElementById(Game.allPlayers[i].name).setAttribute("data-score", Game.allPlayers[i].totalScore);
        }
        Game.allPlayers[i].frames.forEach((element, index) =>{
          frameScores += `| Frame ${index + 1} : ${element.join("-")}`
        });
        let playerInfo = `${Game.allPlayers[i].name}  ${frameScores} | Score : ${Game.allPlayers[i].totalScore}`;
        document.getElementById(Game.allPlayers[i].name).innerText = playerInfo;
        frameScores = "";
      };
    };
    
    Game.sorter = ()=>{
      let h4 = [];
      let classname = document.getElementsByClassName('headerTag');
      let br = document.getElementsByTagName("br")[0];
      for(var i = 0; i < classname.length; ++i){
          h4.push(classname[i]);
      };
      h4.sort((a, b) =>{
          return a.dataset.score.localeCompare(b.dataset.score);
      });
      h4.forEach(function(element) {
          document.body.insertBefore(element, br);
      });
    };
  //end of constructor
  };

  play(){
    document.getElementById("err2").innerText = ""
    let roll, err, isOver;
    let checkRoll = 10 - Game.allPlayers[0].previousRoll;
    roll = parseInt(document.getElementById("throw").value, 10)
    if(roll > checkRoll){
      err = document.getElementById("err2").innerText = `Please enter a number between 0 - ${checkRoll}`;
      return err;
    };
    Game.allPlayers[0].gameOver();
    if(Game.playersDone == Game.allPlayers.length){
      Game.sorter()
      document.getElementById("gameUI").style.display = "none";
      document.getElementById("gameover").style.color = "blue";
      isOver = document.getElementById("gameover").innerHTML = `<h1> Game Over</h1>`
      return isOver;
    };
    if(isNaN(roll) || typeof roll == "null" /*|| roll == ""*/ || typeof roll == "undefined" || typeof roll == "string"){
      err = document.getElementById("err2").innerText = "Please fill in a number of pins to hit"
      return err;
    };
    Game.allPlayers[0].rules(roll);
    Game.leaderboard();
    if(Game.allPlayers.length == 1){
      document.getElementById("roundThrow").innerText = `${Game.allPlayers[0].round} Throws : ${Game.allPlayers[0].throws}`;
      document.getElementById("nameCurrent").innerText = `${Game.allPlayers[0].name} - ${Game.allPlayers[0].totalScore} Points`;
      document.getElementById("Next").style.display = "none";
    }
    else if(Game.allPlayers.length > 1){
      document.getElementById("Next").style.display = "initial";
      document.getElementById("roundThrow").innerText = `${Game.allPlayers[0].round} Throws : ${Game.allPlayers[0].throws}`;
      document.getElementById("nameCurrent").innerText = `${Game.allPlayers[0].name} - ${Game.allPlayers[0].totalScore} Points`;
      document.getElementById("nameNext").innerText = `${Game.allPlayers[Game.allPlayers.length - 1].name} - ${Game.allPlayers[Game.allPlayers.length - 1].totalScore} Points`;
      }  
    document.getElementById("nameForm").style.display = "none";
    document.getElementById("throw").focus();
    document.getElementById("throw").value = "";
  };

  createPlayer() {
    let player;
    let name = document.getElementById("name").value;
    (name == "") ? document.getElementById("err")
      .innerHTML = "*Please enter your name."
      :(player = new Player(name),
      Game.allPlayers.push(player),
      document.getElementById("name").value = "",
      document.getElementById("name").focus()
        )
    this.gameUI();
    if(Game.allPlayers.length == 1){
      document.getElementById("roundThrow").innerText = `1 Throws: 2`;
      document.getElementById("nameCurrent").innerText = `${Game.allPlayers[0].name} - 0 Points`;
      document.getElementById("Next").style.display = "none";
    }
    else if(Game.allPlayers.length > 1){
      document.getElementById("Next").style.display = "initial";
      document.getElementById("roundThrow").innerText = `1 Throws: 2`;
      document.getElementById("nameCurrent").innerText = `${Game.allPlayers[0].name} - 0 Points`;
      document.getElementById("nameNext").innerText = `${Game.allPlayers[Game.allPlayers.length - 1].name} - 0 Points`;
      }
  };

  gameUI(){
    if(Game.isUISet == false){
      Game.isUISet = true;
      let create, input, submit, nameCurrent, nameNext, roundThrow, error;      
      let elements = ["Round", "Current", "Next", "PinsHit"];
        elements.forEach(item => {
          create = document.createElement("h3"); 
          item == elements[1] || item == elements[2] ? create.innerText = item + " Player |" : (item == elements[0] || item == elements[3] ? create.innerText = item + " |": null);
          document.getElementById("gameUI").appendChild(create).id = item;
          if(item == "PinsHit"){
            input = document.createElement("input");
            input.setAttribute("id", "throw");
            input.setAttribute("type", "number");
            input.setAttribute("placeholder", "pins to hit?");
            input.setAttribute("required", true);
            submit = document.createElement("input");
            submit.setAttribute("type", "button");
            submit.setAttribute("id", "btn");
            submit.setAttribute("value", "submit");
            submit.addEventListener("click", game.play);
            submit.addEventListener("click", Game.sorter);
            document.getElementById("PinsHit").appendChild(input);
            document.getElementById("PinsHit").appendChild(submit);
            }
        });
        error = document.createElement("p");
        error.setAttribute("id", "err2")
        error.style.color = "red"
        roundThrow = document.createElement("h3");
        roundThrow.setAttribute("id", "roundThrow");
        roundThrow.style.display = "inline"
        roundThrow.style.marginLeft = "5px";
        nameCurrent = document.createElement("h3");
        nameCurrent.setAttribute("id", "nameCurrent");
        nameCurrent.style.display = "inline";
        nameCurrent.style.marginLeft = "5px";
        nameNext = document.createElement("h3");
        nameNext.setAttribute("id", "nameNext");
        nameNext.style.display = "inline";
        nameNext.style.marginLeft = "5px";
        document.getElementById("Round").appendChild(roundThrow);
        document.getElementById("Current").appendChild(nameCurrent);
        document.getElementById("Next").appendChild(nameNext);
        document.getElementById("PinsHit").appendChild(error);
        document.getElementById("gameUI").style.borderBottom = "2px solid #000"
        document.getElementById("leaderboard").style.borderBottom = "2px solid #000"
      };
    };
};
let game = new Game()