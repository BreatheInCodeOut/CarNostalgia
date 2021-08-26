import { Component, OnInit } from '@angular/core';
import { GameStatus } from 'src/app/enum/game-codes';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {
  showStart: boolean = true;
  showTryAgain: boolean = false;
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.gameStatus.subscribe(
      result => {
        if(result == GameStatus.GAME_OVER || result == GameStatus.WON)
        {
          this.showTryAgain = true;
        }
      }
    )
  }

  OnStart()
  {
    this.gameService.UpdateGameStatus(GameStatus.STARTED);
    this.showStart = false;
    this.showTryAgain = false;
  }
}
