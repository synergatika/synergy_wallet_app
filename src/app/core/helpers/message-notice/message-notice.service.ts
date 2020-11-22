import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageNotice } from './message-notice.interface';

@Injectable({
    providedIn: 'root'
})
export class MessageNoticeService {
    onNoticeChanged$: BehaviorSubject<MessageNotice>;

    constructor() {
        this.onNoticeChanged$ = new BehaviorSubject(null);
    }

    setNotice(message: string, type?: string) {
        const notice: MessageNotice = {
            message,
            type
        };
        this.onNoticeChanged$.next(notice);
    }
}
