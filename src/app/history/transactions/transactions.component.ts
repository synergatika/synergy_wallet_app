// Core
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

// Rxjs
import { first, tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Services
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoyaltyService } from '../../core/services/loyalty.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  access: string = '';
  transactions = [];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService
  ) {
    this.access = this.authenticationService.currentUserValue.user["access"];
    this.unsubscribe = new Subject();
  }

	/**
	 * On init
	 */
  ngOnInit() {
    this.fetchTransactionsData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchTransactionsData() {
    this.loyaltyService.readTransactions()
      .pipe(
        tap(
          data => {
            this.transactions = data;
          },
          error => {
            // this.error = error.error.message || "Unknown Server Error";
            //    this.loading = false;
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
