import { ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'kt-modal3',
    templateUrl: './synergy_terms.component.html',
})
export class TermsComponent implements OnInit, OnDestroy {


    constructor(
        public dialog: MatDialog,
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

}