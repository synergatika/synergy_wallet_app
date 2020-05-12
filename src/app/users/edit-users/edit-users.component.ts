import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
//import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
// import { AddSupportComponent } from '../add-support/add-support.component';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatCheckboxChange } from '@angular/material';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatCheckboxChange } from '@angular/material';
// Services, Models & Interfaces
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../core/services/users.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user.model'
// Local Services, Models & Interfaces
// import { SupportService } from '../_support.service';
// import { SupportInterface } from '../_support.interface';
// Swal Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  public users: User[];

  displayedColumns: string[] = ['user_id', 'email', 'card', 'createdAt', 'activated'];
  dataSource: MatTableDataSource<any>;

  constructor(
    public matDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private usersService: UsersService
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeUsersData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeUsersData() {
    this.usersService.readUsers('customer', '0-0-0')
      .pipe(
        tap(
          data => {
            this.users = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
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

  changeUserActivation(user_id: string, event: MatCheckboxChange) {

    this.loading = true;

    this.usersService.reactivateUser(user_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.USER_REACTIVATED'),
              icon: 'success',
              timer: 2500
            })
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
          this.initializeUsersData();
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  // openModal() {
  //   const dialogConfig = new MatDialogConfig();
  //   // The user can't close the dialog by clicking outside its body
  //   dialogConfig.disableClose = true;
  //   dialogConfig.id = "modal-component";
  //   dialogConfig.height = "350px";
  //   dialogConfig.width = "600px";
  //   dialogConfig.data = {
  //     campaign_id: this.campaign_id,//'5e3298c9ba608903716b09c2'
  //   };
  //   // https://material.angular.io/components/dialog/overview
  //   const modalDialog = this.matDialog.open(AddSupportComponent, dialogConfig);
  //   modalDialog.afterClosed().subscribe(value => {
  //     if (value) this.fetchSupportsData();
  //   });
  // }

  // closeModal(event) {
  //   console.log("NOOO", event);
  // }
}
