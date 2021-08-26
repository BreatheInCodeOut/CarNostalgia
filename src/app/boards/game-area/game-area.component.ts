import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { GameStatus } from 'src/app/enum/game-codes';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.scss']
})
export class GameAreaComponent implements OnInit {
  moveOppBy: number; moveBy: number; 
  minLeft: number; maxLeft: number; bottom: number; top: number;
  callBackDuration: number;
  availableCars: string[];
  maxOpponents: number;
  player: ElementRef;
  imgPath: string;
  imgWidth: number; imgHeight: number;

  curOpponents: number = 0;
  maxLevelOpponents:number = 0;
  reloadOpponents: number = 0;
  
  levels: number;lives: number;
  currentLevel: number;livesLeft: number;
  levelUp: number;
  score: number;

  isPlayerCrashed: boolean = false;
  randomOpponents: string[];

  currentBorderClass = "border1";

  showFlashMessage:boolean = false;
  flashMessage:string = "";

  gameStatus: GameStatus = GameStatus.NOT_STARTED;
  constructor(private gameService: GameService, private elementRef: ElementRef,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.gameService.gameStatus.subscribe(
      status => { 
        this.gameStatus = status; 
        this.processStatus();
      }
    );
  }

  initializeGameParameters(){
    this.player = new ElementRef(document.getElementById("player"));
    
    this.moveBy = this.gameService.movePlayerBy;
    this.minLeft = this.gameService.leftMinPosition;
    this.maxLeft = this.gameService.leftMaxPosition;
    this.availableCars = Object.assign([], this.gameService.availableCars);
    this.maxOpponents = this.gameService.maximumOppponents;
    this.imgPath = this.gameService.imageLocation;
    this.moveOppBy = this.gameService.moveOpponentBy;
    this.callBackDuration = this.gameService.callBackDuration;
    this.bottom = this.gameService.bottomPosition;
    this.top = this.gameService.topPosition;
    this.imgHeight = this.gameService.imageHeight;
    this.imgWidth = this.gameService.imageWidth;
    this.levels = this.gameService.levels;
    this.lives = this.gameService.lives;
    this.levelUp = this.gameService.levelUpScore;

    let randomNumber = this.getRandomNumber(this.availableCars.length);
    this.player.nativeElement.src = this.imgPath + this.availableCars[randomNumber];
    
    this.availableCars.splice(randomNumber, 1); 
    
    this.randomOpponents = new Array();
    for (let index = 0; index < this.maxOpponents; index++) {
      let stringCar:string = this.availableCars[this.getRandomNumber(this.availableCars.length)];
      this.randomOpponents.push(stringCar);
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.gameStatus == GameStatus.STARTED)
    {
        let curPosition = parseInt(this.player.nativeElement.style.left);        
        if(event.code === "ArrowLeft" && (curPosition-this.moveBy) >= this.minLeft)
        {
          this.player.nativeElement.style.left = (curPosition-this.moveBy) + "px";
        }
        else if(event.code === "ArrowRight" && (curPosition+this.moveBy) <= this.maxLeft)
        {
          this.player.nativeElement.style.left = (curPosition+this.moveBy) + "px";
        }
    }
  }

  getRandomNumber(maximum: number): number
  {
    return Math.floor(Math.random() * maximum);
  }

  processStatus()
  {
    if(this.gameStatus == GameStatus.STARTED){
      this.showMessage("Ready");
      this.initializeGameParameters();
      setTimeout(() => {
        this.startGame();
      }, 4000);
    }
    else {
      this.clearOpponents();
    }
  }

  startGame()
  {
    this.livesLeft = this.lives;
    this.currentLevel = 1;
    this.score = 0;
    this.gameService.UpdateLevel(this.currentLevel);
    this.gameService.UpdateScore(this.score);
    this.gameService.UpdateLives(this.livesLeft);
    this.resetOpponents();
    console.log("Game Started");
    this.loadOpponent(this.curOpponents);
  }

  loadOpponent(index: any)
  {
    if(this.gameStatus == GameStatus.STARTED) {
      let playerId: string = 'opponentPlayer' + index;
      var imgOpponent = this.document.createElement('img');
      imgOpponent.src = this.imgPath + this.randomOpponents[index-1];
      imgOpponent.id = playerId;  
      imgOpponent.style.top = this.top + 'px';
      imgOpponent.style.width = this.imgWidth + 'px';
      imgOpponent.style.height = this.imgHeight + 'px';
      imgOpponent.style.position = "absolute";
      imgOpponent.style.left = (this.minLeft + this.getRandomNumber(4)*this.imgWidth) + 'px';
      this.renderer.appendChild(this.elementRef.nativeElement, imgOpponent); 

      setTimeout(() => {
        this.moveOpponent(playerId);  
      }, this.callBackDuration);
    }
  }

  moveOpponent(playerId: string)
  {
    if(this.gameStatus != GameStatus.STARTED) {return;}

    var objOppPlayer = new ElementRef(document.getElementById(playerId));
    let curPosition = parseInt(objOppPlayer.nativeElement.style.top);  
    let curBottomPosition = parseInt(objOppPlayer.nativeElement.style.top) + this.imgHeight;  

    if (this.isPlayerCrashed == true || this.checkCrash(playerId) == true) { this.isPlayerCrashed = true; return; }

    if(this.score == this.levelUp * (this.currentLevel * 2))
    {
      this.currentLevel++;
      this.moveOppBy = (this.currentLevel <= 3 ? this.currentLevel: this.moveOppBy);
      this.callBackDuration = (this.currentLevel <= 3 ? this.callBackDuration-1: this.callBackDuration);

      if(this.currentLevel > this.levels) {
        this.gameService.UpdateGameStatus(GameStatus.WON);
        this.showMessage("::: You Won :::");
      } 
      else {
        this.gameService.UpdateLevel(this.currentLevel);
        this.showMessage("Level - " + this.currentLevel);
      }
    }
    
    if((curBottomPosition + this.moveOppBy) > this.bottom)
    {      
      document.getElementById(playerId).remove();
      this.reloadOpponents--;
      
      this.score++;
      this.gameService.UpdateScore(this.score);

      if(this.reloadOpponents == 0) {
        this.resetOpponents();
        this.loadOpponent(this.curOpponents);        
      }
    }
    else
    {
      objOppPlayer.nativeElement.style.top = (curPosition+this.moveOppBy) + "px";  
      if(this.curOpponents < this.maxLevelOpponents
        && playerId.indexOf(this.curOpponents.toString()) != -1
        && curPosition > (this.top*this.curOpponents + this.imgHeight))
      {
        this.curOpponents++;
        this.reloadOpponents = this.curOpponents;
        this.loadOpponent(this.curOpponents);
      }

      setTimeout(() => {
        this.moveOpponent(playerId);  
      }, this.callBackDuration);

      setTimeout( () => {
        this.changeBorders()
      }, this.callBackDuration); 
    }
  }

  checkCrash(playerId: string) : boolean
  {
    var objPlayer = new ElementRef(document.getElementById("player")).nativeElement.getBoundingClientRect();
    var objOppPlayer = new ElementRef(document.getElementById(playerId)).nativeElement.getBoundingClientRect();

    if( 
        objOppPlayer.top + this.imgHeight >= objPlayer.top &&
        objOppPlayer.left <= objPlayer.left + (this.imgWidth/2) &&
        objOppPlayer.left + (this.imgWidth/2) >= objPlayer.left
      )
    {
      console.log("Crashed");
      this.livesLeft--;
      this.gameService.UpdateLives(this.livesLeft);
      document.getElementById(playerId).setAttribute("src", this.imgPath + "FireBlows.gif");
      setTimeout(() => {
        this.resetAndResume();  
      }, 2000);
      return true;
    }
    return false;
  }

  resetAndResume()
  {
    this.clearOpponents();
    this.isPlayerCrashed = false;

    if(this.livesLeft == 0){
      this.gameService.UpdateGameStatus(GameStatus.GAME_OVER);
      this.showMessage("Game Over");
    }
    else{
      this.resetOpponents();
      this.loadOpponent(this.curOpponents);
    }
  }

  clearOpponents()
  {
    for(var remove=1; remove <= this.curOpponents; remove++)
    {
      if(document.getElementById('opponentPlayer' + remove))
      {
        document.getElementById('opponentPlayer' + remove).remove();     
      }
    }
  }

  resetOpponents()
  {
    this.curOpponents = 1;
    this.maxLevelOpponents = this.gameService.GetOpponents(this.currentLevel);
    this.reloadOpponents = this.curOpponents;
  }

  changeBorders()
  {
    if(this.currentBorderClass == "border1") {
      this.currentBorderClass = "border2";
    }
    else{
      this.currentBorderClass = "border1";
    }
    this.document.getElementById("container").className = this.currentBorderClass;
  }

  showMessage(msg:string)
  {
    this.showFlashMessage = true;
    this.flashMessage = msg;
  }
}