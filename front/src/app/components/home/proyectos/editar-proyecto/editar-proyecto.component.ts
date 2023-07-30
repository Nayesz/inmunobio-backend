import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuarios.model';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-editar-proyecto',
  templateUrl: './editar-proyecto.component.html',
  styleUrls: ['./editar-proyecto.component.css']
})
export class EditarProyectoComponent implements OnInit {
  element!: any;
  modo!: string;
  mensajeAlert: string;
  alert!: boolean;
  estado!: string;
  cargando: boolean;
  usuario:any;
  formProyecto!: FormGroup;
  idProyecto!: number;
  directorProyecto: any ;
  usuariosDisponibles = [];
  itemList: any = [];
  selectedItems = [];
  settings = {};
  disabledForm: boolean;
  nombreDirectorProyecto : string;

  constructor(
    private getService: GetService,
    private postService: PostService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    public toastService: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.nombreDirectorProyecto = JSON.parse(localStorage.getItem('usuario')).nombre;
    this.directorProyecto = JSON.parse(localStorage.getItem('usuario'));
    this.getService.obtenerCandidatosProyecto().subscribe(res => {
      if (res){
        this.itemList = res;
        this.usuariosDisponibles = res;
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
    });
    this.settings = {
      text: 'Seleccione usuarios',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id',
      labelKey: 'nombre',
      enableSearchFilter: true,
      searchBy: ['nombre'],
      disabled: false
    };

    this.formProyecto = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      codigoProyecto: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      montoInicial: new FormControl('',[Validators.required]),
      idDirectorProyecto: new FormControl(JSON.parse(localStorage.getItem('usuario')).id, [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      usuarios: new FormControl([], [Validators.required]),
      nomDirP: new FormControl(JSON.parse(localStorage.getItem('usuario')).nombre),
    });

      this.cargando = true;
      this.idProyecto = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);
      this.getService.obtenerProyectosPorId(this.idProyecto).subscribe(res => {
        if (res){
            this.element = res;
            this.formProyecto.patchValue({
              nombre: this.element.nombre,
              codigoProyecto: this.element.codigoProyecto,
              montoInicial: this.element.montoInicial,
              descripcion: this.element.descripcion
            });
            this.getService.obtenerUsuarioPorProyecto(this.element.id_proyecto).subscribe(usuarios => {
              const participantes = res.participantes.map(user => user.id);
              this.selectedItems = usuarios.filter( usuario => participantes.indexOf(usuario.id) > -1);
              this.cargando = false;
            });
            this.itemList = this.usuariosDisponibles;
          this.cargando = false;
        } else {
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          this.cargando = false;
          setTimeout(() => {
            this.toastService.removeAll()
          }, 3000);
        }
        });
   
  }

  crearProyecto(): void {
    this.disabledForm = true;
    const int = [];
    this.selectedItems.map(usuario => {
      int.push(usuario.id);
    });
    const proyecto: any = {
      codigoProyecto: this.formProyecto.value.codigoProyecto,
      nombre: this.formProyecto.value.nombre,
      descripcion: this.formProyecto.value.descripcion,
      participantes: int,
      idDirectorProyecto: JSON.parse(localStorage.getItem('usuario')).id,
      montoInicial: this.formProyecto.value.montoInicial,
    };

    if (!this.formProyecto.invalid){
      proyecto.id_proyecto = this.idProyecto;
      this.postService.modificarProyecto(proyecto).subscribe(res => {
          this.toastService.show('Proyecto Editado', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.disabledForm = false;
            this.volver();
          }, 3000);
        }, err => {
          let mensaje = err.error.Error[0]
          this.toastService.show('Problema al editar Proyecto: ' + mensaje, { classname: 'bg-danger text-light', delay: 2000 });
          this.disabledForm =false;
          setTimeout(() => {
            this.toastService.removeAll()
          }, 3000);
      });
    }
  }

  volver(): void{
    let ruta = `home/proyectos/${this.idProyecto}`;
    this.router.navigateByUrl(ruta);
  }

}
