import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { postUsuario } from 'src/app/models/usuarios.model';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { LogService } from 'src/app/services/log.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  usuario: any;
  idUsuario: number;
  formUsuario!: FormGroup;
  permisos = [];
  cargando: boolean;
  disabledForm: boolean;
  itemList: any = [];
  selectedItems = [];
  settings: any;
  constructor(
    private getService: GetService,
    private postService: PostService,
    private router: Router,
    public toastService: ToastServiceService,
    private logger: LogService
  ) {
  }

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  ngOnInit(): void {
    this.cargando = true;

    this.getService.obtenerPermisos().subscribe((res: any) => {
      if (res) {
        this.permisos = res;
        this.itemList = res.filter(permiso => permiso.id_permiso !== 5);
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error', { classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
    });

    this.settings = {
      text: 'Seleccione el/los permisos del usuario',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id_permiso',
      labelKey: 'descripcion',
      enableSearchFilter: true,
      searchBy: ['descripcion'],
      disabled: false,
    };

    this.formUsuario = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      direccion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      telefono: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      nivel: new FormControl([],),
    });

  }

  crearUsuario(): void {
    this.disabledForm = true;
    this.settings = {
      text: 'Seleccione el/los permisos del usuario',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id_permiso',
      labelKey: 'descripcion',
      enableSearchFilter: true,
      searchBy: ['descripcion'],
      disabled: true,
    };
    const usuario: postUsuario = {
      nombre: this.formUsuario.value.nombre,
      password: this.formUsuario.value.password,
      direccion: this.formUsuario.value.direccion,
      email: this.formUsuario.value.email,
      telefono: JSON.stringify(this.formUsuario.value.telefono),
      permisos: this.formUsuario.value.nivel
    };


    if (!this.formUsuario.invalid) {
      this.postService.crearUsuario(usuario)
        .pipe(
          catchError(error => {
            return throwError(error); // Devuelve un observable válido en caso de error
          }))
        .subscribe(
          (res) => {
          if (res.Status) {
            this.toastService.show('Usuario Creado', { classname: 'bg-success text-light', delay: 2000 });
            setTimeout(() => {
              this.volver();
              this.toastService.removeAll()
            }, 2000);
          }
        }, (err) => {
          let mensaje = err["error"]["Error"][0]
          this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 2000 }); //TODO : enviar el error con otro formato
          this.clearForm();
        });
    
    }else{
      return
    }

  }


clearForm(): void {
  this.disabledForm = false;
  this.settings = {
    text: 'Seleccione permisos',
    selectAllText: 'Seleccione Todos',
    unSelectAllText: 'Quitar Todos',
    classes: 'myclass custom-class',
    primaryKey: 'id_permiso',
    labelKey: 'descripcion',
    enableSearchFilter: true,
    searchBy: ['descripcion'],
    disabled: false,
  };
}

volver(): void {
  this.router.navigateByUrl('home/configuracion/usuarios');
}
}
