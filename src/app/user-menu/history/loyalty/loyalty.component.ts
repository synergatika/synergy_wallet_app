import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

/**
 * Services
 */
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';

import { LoyaltyTransaction } from 'sng-core';

@Component({
  selector: 'app-loyalty-history',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyHistoryComponent implements OnInit, OnDestroy {

  /**
   * Content Variables
   */
  public transactions: LoyaltyTransaction[];

  access: string = '';

  p: number = 1;
  loading: boolean = false;
  private unsubscribe: Subject<any>;

	/**
	 * Component Constructor
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
   * On Init
   */
  ngOnInit() {
    this.access = this.authenticationService.currentUserValue.user["access"];
    this.fetchTransactions();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Fetch Transactions List (for One User)
   */
  fetchTransactions() {
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
}
