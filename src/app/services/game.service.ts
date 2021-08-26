import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GameStatus } from "../enum/game-codes";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    currentGameStatus : GameStatus = GameStatus.NOT_STARTED;
    moveOpponentBy: number = 2;
    movePlayerBy: number = 50;
    callBackDuration: number = 8;//8
    levelUpScore: number = 10;
    
    topPosition: number = 20;
    leftMinPosition: number = 120;
    leftMaxPosition: number = 420;
    bottomPosition: number = 610;

    levels: number = 6;
    lives = 5;//3
    maximumOppponents: number = 3;
    
    imageWidth: number = 100;
    imageHeight: number = 150;
    availableCars: string[] = ["F11.png", "F12.png", "F13.png", "F14.png"];
    imageLocation = "..\\..\\assets\\images\\";

    gameStatus = new Subject<GameStatus>();
    playerScore = new Subject<number>();
    currentLevel = new Subject<number>();
    livesRemaining = new Subject<number>();

    UpdateGameStatus(status: GameStatus)
    {
        this.currentGameStatus = status;
        this.gameStatus.next(this.currentGameStatus);
    }

    UpdateScore(score: number)
    {
        this.playerScore.next(score);        
    }

    UpdateLevel(level:number)
    {
        this.currentLevel.next(level);
    }

    UpdateLives(lives:number)
    {
        this.livesRemaining.next(lives);
    }

    GetOpponents(level:number): number
    {
        let curOpponents = 1;
    
        if(level == 3 || level == 4) {
          curOpponents = 2;
        }
        else if(level >= 5){
          curOpponents = 3;
        }
        return curOpponents;
    }
}