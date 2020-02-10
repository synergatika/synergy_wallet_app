import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';

// Services
import { AuthenticationService } from '../core/services/authentication.service';
import { LoyaltyService } from '../core/services/loyalty.service';
import { MicrocreditService } from '../core/services/microcredit.service';

// Models
import { MicrocreditSupport } from '../core/models/microcredit-support.model';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.sass']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

  balance: number = 0;
  badge: any;
  supports: MicrocreditSupport[];

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
    private loyaltyService: LoyaltyService,
    private microcreditService: MicrocreditService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
  * On init
  */
  ngOnInit() {
    this.fetchBalanceData();
    this.fetchBadgeData();
    this.fetchSupportsData();
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

  fetchSupportsData() {
    this.microcreditService.readAllSuports()
      .pipe(
        tap(
          data => {
            this.supports = data;
            console.log(this.supports);
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