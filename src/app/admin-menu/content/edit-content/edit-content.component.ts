import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { ContentService } from 'src/app/core/services/content.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss']
})
export class EditContentComponent implements OnInit {

  /**
   * Parameters
   */
  private content_id: string;

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
   * @param activatedRoute: ActivatedRoute
   * @param translate: TranslateService
   * @param contentService: ContentService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private contentService: ContentService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      this.content_id = params['content_id'];
    });
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.fetchContentData();
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
   * Fetch Content Datas
   */
  fetchContentData() {
    console.log(this.content_id);
    this.contentService.readContentById(this.content_id)
      .pipe(
        tap(
          data => {
            this.submitForm.patchValue({ ...data })
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

    this.contentService.updateContent(this.content_id, controls.name.value, controls.el_title.value, controls.en_title.value, controls.el_content.value, controls.en_content.value)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.CONTENT_UPDATED'),
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
