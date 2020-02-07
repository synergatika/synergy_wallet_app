import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';

// Services
import { AuthenticationService } from '../core/services/authentication.service';
import { LoyaltyService } from '../core/services/loyalty.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.sass']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

  balance: number = 0;
  badge: any;

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
    this.fetchBalanceData();
    this.fetchBadgeData();
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchBadgeData() {
    this.loyaltyService.readBadge()
      .pipe(
        tap(
          data => {
            this.badge = parseInt(data.points, 16);
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

  fetchBalanceData() {
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
}