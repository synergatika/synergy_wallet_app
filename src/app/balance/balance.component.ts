import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';

import { AuthenticationService } from '../core/services/authentication.service'
import { LoyaltyService } from '../core/services/loyalty.service'

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.sass']
})
export class BalanceComponent implements OnInit, OnDestroy {

  balance: number = 0;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
 * Component constructor
 *
 * @param cdRef: ChangeDetectorRef
 * @param authenticationService: AuthenticationService
 * @param loyaltyService: LoyaltyService
 */
  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
  * On init
  */
  ngOnInit() {
    this.loyaltyService.readBalance()
      .pipe(
        tap(
          data => {
            this.balance = parseInt(data.points, 16);
          },
          error => {
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }
}
