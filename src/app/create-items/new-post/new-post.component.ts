import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.sass']
})
export class NewPostComponent implements OnInit, OnDestroy {

  validator: any;

  fileData: File = null;
  previewUrl: any = null;
  showImageError: boolean = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component constructor
    *
    * @param fb: FormBuilder
    * @param cdRef: ChangeDetectorRef
    * @param router: Router
    * @param translate: TranslateService
    * @param itemsService: ItemsService
    * @param staticDataService: StaticDataService
    */
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService,
  ) {
    this.validator = this.staticDataService.getPostValidator;
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.title.minLength),
        Validators.maxLength(this.validator.title.maxLength)
      ])
      ],
      itemAbstract: [''],
      content: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.content.minLength),
        Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      access: ['public', Validators.compose([
        Validators.required
      ])
      ],
      profile_avatar: ['', Validators.compose([
        Validators.required
      ])
      ],
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    if (this.fileData == null) {
      this.onImageCancel();
      return;
    }
    this.showImageError = false;

    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      if (this.previewUrl !== reader.result) {
        this.cdRef.markForCheck();
      }
      this.previewUrl = reader.result;
    }
  }

  onImageCancel() {
    this.previewUrl = null;
    this.fileData = null;
    this.showImageError = true;
    this.cdRef.markForCheck();
  }

	/**
	 * On Form Submit
	 */
  onSubmit() {
    if (this.submitted || this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid || !this.fileData) {
      if (!this.fileData) this.showImageError = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('subtitle', controls.itemAbstract.value);
    formData.append('content', controls.content.value);
    formData.append('access', controls.access.value);

    this.itemsService.createPost(formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.POST_CREATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/m-posts']);
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
          this.submitted = false;
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
