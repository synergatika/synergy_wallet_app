import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() previousURL: string;
  @ViewChild('fileInput') fileInput: ElementRef;

  imageURL: string;
  showImageSizeError: boolean = false;
  validator: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private staticDataService: StaticDataService
  ) {
    this.validator = this.staticDataService.getValidators.imageURL;
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.imageURL = this.previousURL;
    if (this.imageURL) {
      this.parentForm.controls['image_url'].clearValidators();
      this.parentForm.controls['image_url'].updateValueAndValidity();
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
  }

  bytesToSize() {
    var bytes = (this.validator.maxSize).toString();
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = 0;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  updateForm(value: any) {
    this.parentForm.patchValue({ image_url: value });
    this.parentForm.get('image_url').updateValueAndValidity();
  }

  cancelImage() {
    this.fileInput.nativeElement.value = '';

    this.imageURL = this.previousURL;
    this.changeDetectorRef.markForCheck();

    this.showImageSizeError = false;
    this.updateForm(null);
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file.size > this.validator.maxSize) {
      this.showImageSizeError = true;
      return;
    }

    if ((file.type).match(/image\/*/) == null) {
      return;
    }

    this.showImageSizeError = false;
    this.updateForm(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (this.imageURL !== reader.result) {
        this.changeDetectorRef.markForCheck();
      }
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.parentForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}