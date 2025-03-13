import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeNode } from '../../models/tree.model';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  user: User | null = null;
  treeDataSource = new MatTreeNestedDataSource<TreeNode>();

  childrenAccessor = (node: TreeNode) => node.children ?? [];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    const getId = this.route.snapshot.paramMap.get('id');
    const id = getId ? +getId : null;
    this.loadUserById(id);
  }

  async loadUserById(id: number | null) {
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        this.user = user;
        this.setTreeInformation(user);
      } else {
        this.showSnackBarAndReDirect('No se encontró el usuario', 'Cerrar');
        this.goToHome();
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  setTreeInformation(user: User) {
    const treeData: TreeNode[] = [
      {
        name: 'Información del Usuario',
        children: [
          { name: `Nombre: ${user.firstName || 'NO CONTIENE'} ${user.lastName1 || 'NO CONTIENE'} ${user.lastName2 || 'NO CONTIENE'}` },
          { name: `Fecha de Nacimiento: ${user.birthDate || 'NO CONTIENE'}` },
          { name: `Género: ${user.gender || 'NO CONTIENE'}` },
          { name: `NIF: ${user.nif || 'NO CONTIENE'}` },
          { name: `NHC: ${user.nhc || 'NO CONTIENE'}` },
          { name: `Tipo de Usuario: ${user.type || 'NO CONTIENE'}` },
          { name: `Profesional: ${user.professionalType || 'NO CONTIENE'}` },
        ],
      },
      {
        name: 'Dirección',
        children: [
          { name: `Ciudad: ${user.address?.city || 'NO CONTIENE'}` },
          { name: `Calle: ${user.address?.street || 'NO CONTIENE'}` },
          { name: `Puerta: ${user.address?.door || 'NO CONTIENE'}` },
          { name: `Número: ${user.address?.number || 'NO CONTIENE'}` },
          { name: `Código Postal: ${user.address?.postalCode || 'NO CONTIENE'}` },
        ],
      },
      {
        name: 'Seguro Médico',
        children: [
          { name: `Nombre del Seguro: ${user.insurers?.name || 'NO CONTIENE'}` },
          { name: `Número de Tarjeta: ${user.insurers?.cardNumber || 'NO CONTIENE'}` },
          { name: `Tipo de Seguro: ${user.insurers?.insuranceType || 'NO CONTIENE'}` },
        ],
      },
    ];
    this.treeDataSource.data = treeData;
  }
  

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  showSnackBarAndReDirect(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  goToHome() {
    this.router.navigate(['/users']);
  }
}
