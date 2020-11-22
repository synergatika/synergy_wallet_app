import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { ContentService } from 'src/app/core/services/content.service';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss']
})
export class CreateContentComponent implements OnInit, OnDestroy {

  /**
   * Form
   */
  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * Component Constructor
   *
   * @param cdRef: ChangeDetectorRef
   * @param fb: FormBuilder
   * @param router: Router
   * @param translate: TranslateService
   * @param contentService: ContentService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private contentService: ContentService
  ) {
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.initForm();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }


  initForm() {
    this.submitForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
      ])
      ],
      el_title: ['', Validators.compose([
        Validators.required,
      ])
      ],
      en_title: ['', Validators.compose([
        Validators.required,
      ])
      ],
      el_content: ['', Validators.compose([
        Validators.required,
      ])
      ],
      en_content: ['', Validators.compose([
        Validators.required,
      ])
      ],
    });
  }

	/**
	 * On Submit Form
	 */
  onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    this.contentService.createContent(controls.name.value, controls.el_title.value, controls.en_title.value,
      controls.el_content.value, controls.en_content.value)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.CONTENT_CREATED'),
              icon: 'success',
              timer: 2500,
            }).then((result) => {
              this.router.navigate(['/a-content']);
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

  /**
  * Checking control validation
  *
  * @param controlName: string => Equals to formControlName
  * @param validationType: string => Equals to valitors name
  */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
