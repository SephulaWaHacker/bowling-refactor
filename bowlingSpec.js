describe("10 pin bowling", function() {
  beforeEach(() => {
    Game.allPlayers = [{"name": "Sephula","frames": [],"throws": 2,"totalScore": 0,"strikeBonus": 0,"sparestrike": 0,"round": 1,"previousRoll": 0},{"name": "Anna","frames": [],"throws": 2,"totalScore": 0,"strikeBonus": 0,"sparestrike": 0,"round": 1,"previousRoll": 0},{"name": "Pule","frames": [],"throws": 2,"totalScore": 0,"strikeBonus": 0,"sparestrike": 0,"round": 1,"previousRoll": 0},{"name": "Neo","frames": [],"throws": 2,"totalScore": 0,"strikeBonus": 0,"sparestrike": 0,"round": 1,"previousRoll": 0}]
    Game.playersDone = 0; 
  })

  let player;
  let game;


  it("test player defaults", ()=>{
    player = new Player("Sephula");
    expect(player.totalScore).toEqual(0);
    expect(player.frames.length).toEqual(0);
    expect(player.throws).toEqual(2);
    expect(player.name).toEqual("Sephula")
    expect(player.strikeBonus).toEqual(0);
    expect(player.spareBonus).toEqual(0);
    expect(player.round).toEqual(1);
    expect(player.previousRoll).toEqual(0);
  });

  it("should create new frame for 1st roll only", ()=>{
    player = new Player();
    player.rules(4) //1st roll
    expect(player.frames.length).toEqual(1);
    player.rules(4) //2nd roll on the 1st frame
    expect(player.frames.length).toEqual(1);
    player.rules(5)//1st roll on 2nd frame
    expect(player.frames.length).toEqual(2);
  });

  it("should increment playersDone if certain conditions are met",()=>{
    player = new Player();
    player.round = 12;
    player.gameOver();
    expect(Game.playersDone).toEqual(1);
    player.round = 11;
    player.frames = [[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[4,5],[1,3],[1,7]]
    player.gameOver();
    expect(Game.playersDone).toEqual(2);
  });

  it("should get strikebonus if players rolls a 10 on the last frame", ()=>{
    player = new Player();
    player.frames = [[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[4,5],[1,3]]
    player.rules(10)
    expect(player.strikeBonus).toEqual(1);
  });

  it("should get sparebonus if a players combined frame score is equals to 10", ()=>{
    player = new Player();
    player.frames = [[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[3,1],[4,5],[1,3]]
    player.rules(1);
    player.rules(9);
    expect(player.spareBonus).toEqual(1);
  });

  it("should switch players after rolling a 10 or after 2 throws", ()=>{
    player = new Player();
    expect(Game.allPlayers[0].name).toEqual("Sephula");
    player.rules(10);
    expect(Game.allPlayers[0].name).toEqual("Neo");
    player.rules(4);
    player.rules(2);
    expect(Game.allPlayers[0].name).toEqual("Pule");
  });

  it("should reset value of throws after a players turn has ended", ()=>{
    player = new Player();
    expect(player.throws).toEqual(2); //default
    player.rules(1);
    expect(player.throws).toEqual(1);
    player.rules(4); //2nd roll in the frame
    expect(player.throws).toEqual(2);
  });

  it("should the value of each roll to players totalscore", ()=>{
    player = new Player();
    expect(player.totalScore).toEqual(0);
    player.rules(6);
    player.rules(4);
    expect(player.totalScore).toEqual(10);
  })
});

