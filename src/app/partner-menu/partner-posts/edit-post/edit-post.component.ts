import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Components
 */
import { ContentImagesComponent } from '../../../core/components/content-images/content-images.component';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { GeneralList } from 'sng-core';


interface EditorFile {
  preview: string;
  file: File;
  url: string;
}

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})

export class EditPostComponent implements OnInit, OnDestroy {
  @ViewChild('remove_item') remove_item;
  // @ViewChild('fileInput') imageInput: ElementRef;
  /**
   * Imported Component
   */
  @ViewChild(ContentImagesComponent, { static: true })
  public editorTextarea: ContentImagesComponent;

  /**
   * Configuration and Static Data
   */
  public accessList: GeneralList[];

  /**
   * Parameters
   */
  private post_id: string;

  /**
   * Content Variables
   */
  public title: string = '';
  public initialImage: string = '';

  /**
   * Forms
   */
  submitForm: FormGroup;
  submitted: boolean = false;
  validator: any;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component Constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param router: Router
    * @param activatedRoute: ActivatedRoute
    * @param fb: FormBuilder
    * @param modalService: NgbModal
    * @param translate: TranslateService
    * @param staticDataService: StaticDataService
    * @param authenticationService: AuthenticationService
    * @param itemsService: ItemsService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.post_id = params['_id'];
    });
    this.accessList = this.staticDataService.getAccessList;
    this.validator = this.staticDataService.getValidators.post;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initForm();
    this.fetchPostData();
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
      subtitle: [''],
      content: ['', Validators.compose([
        Validators.required,
        //    Validators.minLength(this.validator.content.minLength),
        //    Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      access: ['public', Validators.compose([
        Validators.required
      ])
      ],
      image_url: [null, Validators.compose([
        Validators.required
      ])
      ],
      contentFiles: [null]
    });
  }

  /**
   * Fetch Post Data
   */
  fetchPostData() {
    this.itemsService.readPost(this.authenticationService.currentUserValue.user["_id"], this.post_id)
      .pipe(
        tap(
          data => {
            this.title = data.title;
            this.initialImage = data.post_imageURL;
            //     this.previewUrl = this.initialImage;
            this.submitForm.patchValue({ ...data });
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

  async onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    await this.editorTextarea.uploadContentFiles();
  }

  onFinalStep(editorFiles: string[]) {
    this.loading = true;
    const controls = this.submitForm.controls;
    const formData = new FormData();
    formData.append('title', controls.title.value);
    formData.append('imageURL', controls.image_url.value);
    formData.append('subtitle', controls.subtitle.value);
    formData.append('content', controls.content.value);
    formData.append('contentFiles', editorFiles.join())
    formData.append('access', controls.access.value);

    this.itemsService.editPost(this.authenticationService.currentUserValue.user["_id"], this.post_id, formData)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.POST_UPDATED'),
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
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
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
    this.itemsService.deletePost(this.authenticationService.currentUserValue.user["_id"], this.post_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.POST_DELETED'),
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
