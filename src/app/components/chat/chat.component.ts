import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent implements OnInit, OnDestroy {
  message: string = '';
  subscriptions: Subscription[] = [];
  el: any;

  constructor(public chatService: ChatService) {
    this.subscriptions.push(
      this.chatService.loadMessages().subscribe(() => {
        setTimeout(() => {
          this.el.scrollTop = this.el.scrollHeight;
        }, 20);
      })
    );
  }

  ngOnInit(): void {
    this.el = document.getElementById('app-messages');
  }

  sendMsg() {
    if (this.message.length === 0) return;
    this.chatService
      .addMsg(this.message)
      .then(() => {
        console.log('msg sent');
        this.message = '';
      })
      .catch((err) => console.log('Error', err));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
