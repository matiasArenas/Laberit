import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['nombre', 'apellidos', 'nifPasaporte', 'profesional', 'seguro', 'acciones'];
  loading: boolean = false;
  error: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private router: Router,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setUserData();
  }

  async setUserData(): Promise<void> {
    this.loading = true;
    try {
      const users = await this.userService.getUsers();
      this.dataSource.data = users;
      this.setPaginator();
    } catch (error) {
      this.error = 'Error al cargar los usuarios';
    }
    finally {
      this.loading = false;
    }
  }

  setPaginator() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  goToAddUser() {
    this.router.navigate(['/create']);
  }

  goToEditUser(id: number) {
    this.router.navigate(['/edit', id]);
  }

  goToInfoUser(id: number) {
    this.router.navigate(['/detail', id]);
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: '¿Está seguro de que desea eliminar este usuario?' },
    });
    dialogRef.afterClosed().subscribe((result) => { 
      if (result) {
        this.userService.deleteUser(id);
        this.setUserData();
      }
    });
  }

  deleteAllDoctors(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: '¿Seguro que quieres eliminar todos los profesionales registrados como médicos?' },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteAllDoctors();
        this.setUserData();
      }
    });
  }
}
