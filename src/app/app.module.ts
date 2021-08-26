import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameAreaComponent } from './boards/game-area/game-area.component';
import { ScoreCardComponent } from './boards/score-card/score-card.component';
import { InstructionsComponent } from './boards/instructions/instructions.component';
import { GameService } from './services/game.service';
import { FlashMessageComponent } from './boards/flash-message/flash-message.component';

@NgModule({
  declarations: [
    AppComponent,
    GameAreaComponent,
    ScoreCardComponent,
    InstructionsComponent,
    FlashMessageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
