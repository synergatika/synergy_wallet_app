import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  /**
   * Children Modals
   */
  @ViewChild('remove_item') remove_item: NgbModalRef;

  /**
   * Content Variables
   */
  public email: string = '';
  public activated: boolean = false;
  /**
   * Forms
   */
  submitForm: FormGroup;
  submitted: boolean = false;

  validator: any;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * @param cdRef: ChangeDetectorRef
    * @param fb: FormBuilder
    * @param modalService: NgbModal
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param authenticationService: AuthenticationService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService
  ) {
    this.validator = this.staticDataService.getValidators.user;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.email = currentUser["user"].email;
    this.activated = currentUser["user"].activated;
    this.initializeForm();
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
   * Initialize Form
   */
  initializeForm() {
    this.submitForm = this.fb.group({
      email: [{ value: this.email, disabled: true }, Validators.compose([])
      ]
    });
  }

  // private swalWithBootstrapButtons = Swal.mixin({
  //   customClass: {
  //     confirmButton: 'btn btn-success',
  //     cancelButton: 'btn btn-danger'
  //   },
  //   buttonsStyling: true
  // })
  // 
  // deleteItemModal() {
  //   this.swalWithBootstrapButtons.fire({
  //     title: this.translate.instant('SETTINGS.DEACTIVATE_CONFRIRM'),
  //     input: 'textarea',
  //     inputPlaceholder: this.translate.instant('FIELDS.PROFILE.DEACTIVATION_REASON.PLACEHOLDER'),
  //     icon: 'warning',
  //     timer: 0,
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //     reverseButtons: true,
  //     inputValidator: (value) => {
  //       if (value && (value.length > this.validator.deactivation_reason.maxLength)) {
  //         return this.translate.instant('FORM.VALIDATION.MAX_LENGTH_FIELD') + ' ' + this.validator.deactivation_reason.maxLength
  //       }
  //     }
  //   }).then((result) => {
  //     console.log(result);
  //     if (result.value) {
  //       this.swalWithBootstrapButtons.fire({
  //         title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
  //         text: this.translate.instant('MESSAGE.SUCCESS.ACCOUNT_DEACTIVATED'),
  //         icon: 'success',
  //         timer: 2500
  //       }).then((result) => {
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // this.swalWithBootstrapButtons.fire({
  //       //   title: this.translate.instant('MESSAGE.CANCEL.TITLE'),
  //       //   //text: 'Your imaginary file is safe :)',
  //       //   icon: 'error',
  //       //   timer: 2500
  //       // });
  //     }
  //   })
  // }

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