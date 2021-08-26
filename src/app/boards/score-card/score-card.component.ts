import { Component, OnInit } from '@angular/core';
import { GameStatus } from 'src/app/enum/game-codes';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss']
})
export class ScoreCardComponent implements OnInit {
  score: number = 0;
  level: number = 0;
  lives: number = 0;
  totalLevels: number = 0;
  arrLives: string[];
  progress:string = "-";
  showScoreCard: boolean = false;
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.totalLevels = this.gameService.levels;
    this.gameService.gameStatus.subscribe(
      result => {
        this.progress = result.toString();
        if(result == GameStatus.STARTED || result == GameStatus.GAME_OVER || result == GameStatus.WON) {
          this.showScoreCard = true;
        }
      }
    )

    this.gameService.playerScore.subscribe(
      result => {this.score = result;}
    )
    this.gameService.currentLevel.subscribe(
      result => {this.level = result;}
    )
    this.gameService.livesRemaining.subscribe(
      result => {this.lives = result; this.arrLives = new Array(this.lives);}
    )
  }
}
