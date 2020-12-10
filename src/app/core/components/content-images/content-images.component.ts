import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/**
 * Services
 */
import { StaticDataService } from '../../helpers/static-data.service';
import { ItemsService } from '../../services/items.service';

export class UploadAdapter {
  private loader;
  private editorFiles;

  constructor(loader, editorFiles) {
    this.loader = loader;
    this.editorFiles = editorFiles;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = (e) => {
            this.editorFiles.push({
              preview: myReader.result,
              file: file,
              url: null,
            });
            resolve({ default: myReader.result });
          };
          myReader.readAsDataURL(file);
        })
    );
  }
}

interface EditorFile {
  preview: string;
  file: File;
  url: string;
}

@Component({
  selector: 'app-content-images',
  templateUrl: './content-images.component.html',
  styleUrls: ['./content-images.component.scss']
})
export class ContentImagesComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() parentService: string;

  @Output()
  finalize: EventEmitter<string[]> = new EventEmitter<string[]>();

  public Editor = ClassicEditor;

  validator: any;

  editorFiles: EditorFile[] = [];
  fileName: string = '';

  showImagesNumberError: boolean = false;
  showImageSizeError: boolean = false;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private controlContainer: ControlContainer,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService
  ) {
    this.validator = this.staticDataService.getValidators.imageURL;
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.parentForm = <FormGroup>this.controlContainer.control;
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

  onReady(editorFiles: EditorFile[], eventData) {
    var that = this;
    that.showImageSizeError = false;
    that.showImagesNumberError = false;

    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      return new UploadAdapter(loader, editorFiles);
    };
  }

  /**
   * Check Images Size
   */
  checkImagesSize(currentFiles: EditorFile[]): boolean {
    const controls = this.parentForm.controls;

    var files: string[] = [];
    currentFiles.forEach((el) => {
      if ((controls.content.value.indexOf(el.preview) > -1) && (el.file.size > this.validator.maxSize)) {
        files.push(el.file.name);
        return;
      };
    });
    this.fileName = files.join('');

    return files.length > 0;
  }

  /**
   * Check Images Number
   */
  checkImagesNumber(currentFiles: EditorFile[], previousFiles: string[]): boolean {
    const controls = this.parentForm.controls;

    var counter: number = 0;
    if (previousFiles && previousFiles.length > 0) {
      previousFiles.forEach((el) => {
        if (controls.content.value.indexOf(el) > -1) {
          counter++;
        }
      })
    }
    if (currentFiles && currentFiles.length > 0) {
      currentFiles.forEach((el) => {
        if (controls.content.value.indexOf(el.preview) > -1) {
          counter++;
        }
      })
    }
    return counter > this.validator.maxNumber
  }

  async uploadContentFiles() {
    const controls = this.parentForm.controls;
    const previousFiles: string[] = (controls.contentFiles.value != null) ? (controls.contentFiles.value) : [];

    this.editorFiles = this.editorFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (f) =>
            JSON.stringify(f.file) === JSON.stringify(file.file) &&
            f.preview === file.preview
        )
    );


    if (this.checkImagesSize(this.editorFiles)) {
      this.showImageSizeError = true;
      return;
    }
    this.showImageSizeError = false;

    if (this.checkImagesNumber(this.editorFiles, previousFiles)) {
      this.showImagesNumberError = true;
      return;
    }
    this.showImagesNumberError = false;

    const formData = new FormData();
    this.editorFiles.forEach((el) => {
      formData.append('content_image', el.file);
    });

    const message$ = this.itemsService[this.parentService](formData);
    message$.subscribe(
      (data) => {
        console.log("Content Images");
        console.log(data.data)
        this.editorFiles.forEach((el) => {
          el['url'] =
            data.data.path + data.data.files[data.data.files.map((e) => e.originalname).indexOf(el.file.name)].filename;
        });

        /**
         * Final Content Value
         */
        var content: string = controls.content.value;
        this.editorFiles.forEach((el) => {
          content = content.split(el.preview).join(el.url);
        });
        controls['content'].setValue(content);

        /**
         * Array of Content Files
         */
        var filesArray: string[] = [];
        (previousFiles.concat(this.editorFiles.map((o) => o.url))).forEach((el) => {
          if (content.indexOf(el) > -1) {
            filesArray.push(el);
          }
        });

        /**
         * Emit Array of Content Files
         */
        this.finalize.emit(filesArray);
      },
      (error) => {
        console.log(error);
      }
    );
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