import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { Message } from '../interfaces/msg.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Message>;
  chats: Message[] = [];
  user: any = {};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user: any) => {

      console.log(user);

      if (!user) return;
      this.user.name = user.displayName;
      this.user.uid = user.uid;
    })
  }

  loadMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats', (ref) =>
      ref.orderBy('date', 'desc').limit(5)
    );
    return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        console.log(messages);
        this.chats = [];
        for (const message of messages) {
          this.chats.unshift(message);
        }
      })
    );
  }

  addMsg(msg: string) {
    let message: Message = {
      name: this.user.name,
      uid: this.user.uid,
      msg,
      date: new Date().getTime(),
    };

    return this.itemsCollection.add(message);
  }

  login() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.user = {};
    this.auth.signOut();
  }
}
