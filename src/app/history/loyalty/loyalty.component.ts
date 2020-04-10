import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Services
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoyaltyService } from '../../core/services/loyalty.service';
// Models
import { LoyaltyTransaction } from '../../core/models/loyalty_transaction.model';

@Component({
  selector: 'app-loyalty-history',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyHistoryComponent implements OnInit, OnDestroy {

  access: string = '';
  public transactions: LoyaltyTransaction[];
  p: number = 1;
  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];

    this.loyaltyService.readTransactions('0-0-0')
      .pipe(
        tap(
          data => {
            this.transactions = data;
            console.log(data);
          },
          error => {
            console.log(error);
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }
}
