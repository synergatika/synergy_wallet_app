import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Translate
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('remove_item', { static: false }) remove_item: any;

  submitForm: FormGroup;
  submitted = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  public email: string = '';

  /**
   * @param cdRef: ChangeDetectorRef
     * @param modalService: NgbModal
  * @param authenticationService: AuthenticationService
   * @param fb: FormBuilder
   * @param translate: TranslateService
   */
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    this.email = currentUser["user"].email;
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initForm() {
    this.submitForm = this.fb.group({
      email: [{ value: this.email, disabled: true }, Validators.compose([])
      ]
    });
  }

  deleteItemModal() {
    this.modalService.open(this.remove_item).result.then((result) => {
      console.log('closed');
    }, (reason) => {
      console.log('dismissed');
    });
  }

  deleteItem() {
    console.log('delete');
    this.authenticationService.deactivate('Other')
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.ACCOUNT_DEACTIVATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.authenticationService.logout()
            });
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant(error),
              'error'
            );
            this.submitted = false;
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