import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UsersService } from '../../../core/services/users.service';

/**
 * Models & Interfaces
 */
import { User } from 'sng-core';


@Component({
  selector: 'app-admin-partners',
  templateUrl: './admin-partners.component.html',
  styleUrls: ['./admin-partners.component.scss']
})
export class AdminPartnersComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Content Variables
   */
  public users: User[];

  /**
   * Data Table Variables
   */
  displayedColumns: string[] = ['user_id', 'email', 'name', 'createdAt', 'activated'];
  dataSource: MatTableDataSource<any>;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * Component Constructor
   *
   * @param cdRef: ChangeDetectorRef
   * @param matDialog: MatDialog
   * @param translate: TranslateService
   * @param authenticationService: AuthenticationService
   * @param usersService: UsersService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private usersService: UsersService
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.fetchUsersData();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Fetch Users Data (partners)
   */
  fetchUsersData() {
    this.usersService.readUsers('partner', '0-0-0')
      .pipe(
        tap(
          data => {
            this.users = data;
            console.log(this.users);
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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
   * Activate User
   */
  activateUser(user_id: string, event: MatCheckboxChange) {

    this.loading = true;
    this.authenticationService.activateUser(user_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.USER_ACTIVATED'),
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
          this.fetchUsersData();
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }


  /**
   * Deactivate User
   */
  deactivateUser(user_id: string, event: MatCheckboxChange) {

    this.loading = true;
    this.authenticationService.deactivateUser(user_id)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.USER_DEACTIVATED'),
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
          this.fetchUsersData();
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

}
