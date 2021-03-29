import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionCollectionService {
  loginSubscriptions: Subscription[] = [];


  DestroySubscriptions(subscriptionList: Subscription[]){
    const promise = subscriptionList.forEach(sub =>
      sub.unsubscribe(),
      console.log("Sub unsubscribed"));
      subscriptionList.length = 0;
      
  }

  constructor() { }

}
