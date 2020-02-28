import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil, finalize, tap } from 'rxjs/operators';

//Modal
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Swal Alert
import Swal from 'sweetalert2';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.sass']
})
export class EditPostComponent implements OnInit, OnDestroy {
	
  @ViewChild('remove_item', {static: false}) remove_item;
  public validator: any = {
    title: {
      minLength: 3,
      maxLenth: 250
    },
    content: {
      minLength: 3,
      maxLenth: 2500
    }
  };
  
  post_id: string;
  fileData: File = null;
  previewUrl: any = null;
  originalImage: boolean = true;

  submitForm: FormGroup;
  submitted: boolean = false;
  post: any;
  title: string;
  content: string;
  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
    * Component constructor
    *
    * @param cdRef: ChangeDetectorRef
    * @param itemsService: ItemsService
    * @param fb: FormBuilder
    * @param translate: TranslateService
    */
  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private translate: TranslateService,
	private modalService: NgbModal,
	private activatedRoute: ActivatedRoute,
	private authenticationService: AuthenticationService,
  ) {
	this.activatedRoute.params.subscribe(params => {
      this.post_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

	/**
	 * On init
	 */
  ngOnInit() {
	this.fetchPostData();
    //this.initForm();
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
      title: [this.title, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.title.minLength),
        Validators.maxLength(this.validator.title.maxLength)
      ])
      ],
      content: [this.content, Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.content.minLength),
        Validators.maxLength(this.validator.content.maxLength)
      ])
      ],
      access: ['', Validators.compose([
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
	  if(this.fileData == null) {
		  this.onImageCancel();
		  return;
	  }
	  this.originalImage = false;
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
    this.originalImage = true;
  }
  
  fetchPostData() {
    this.itemsService.readPost(this.authenticationService.currentUserValue.user["_id"],this.post_id)
      .pipe(
        tap(
          data => {
            this.post = data;
            console.log(this.post);
			this.title = this.post.title;
			this.content = this.post.content;
			console.log(this.content);
			this.initForm();
			this.cdRef.markForCheck();
            //this.scannerService.changeOffers(this.post);
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
	 * On Form Submit
	 */
  onSubmit() {
    if (this.submitted) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;
    this.submitted = true;

    const formData = new FormData();
    formData.append('imageURL', this.fileData);
    formData.append('title', controls.title.value);
    formData.append('content', controls.content.value);
    formData.append('access', controls.access.value);

    this.itemsService.createPost(formData)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.POST_CREATED'),
              'success'
            );
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant('MESSAGE.ERROR.SERVER'),
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
  
	deleteItemModal() {
		this.modalService.open(this.remove_item).result.then((result) => {
		//this.searchText = '';
		console.log('closed');
		//this.showList = false;
		}, (reason) => {
			console.log('dismissed');
			//this.showList = false;
		});
	}
	
	deleteItem() {
		console.log('delete');
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
