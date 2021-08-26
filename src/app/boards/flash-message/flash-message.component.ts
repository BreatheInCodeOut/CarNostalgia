import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.scss']
})
export class FlashMessageComponent implements OnInit {
  private _msg: string;
  
  expireAfter: number = 3;
  showTimer:boolean = false;
  count: number = this.expireAfter+1;

  @Input() set message(msg: string) {
    this._msg = msg;
    this.clearMessage();
  }

  get message():string{
    return this._msg;
  }

  clearMessage()
  {
    if(this.message == "Ready"){
      this.showTimer = true;
    }

    if(this.showTimer) {
      this.count = this.expireAfter + 1;
      console.log(this.count);
      this.startCountDown();
    }

    setTimeout(() => {
      this._msg = "";
      this.showTimer = false;
    }, this.expireAfter*1000);
  }

  startCountDown()
  {
    this.count--;
    if(this.count != 0) {
      setTimeout(() => {
        this.startCountDown();
      }, 1000);
    }
    else {
      this.showTimer = false;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
