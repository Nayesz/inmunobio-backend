import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuarios.model';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-nuevo-proyecto',
  templateUrl: './nuevo-proyecto.component.html',
  styleUrls: ['./nuevo-proyecto.component.css']
})
export class NuevoProyectoComponent implements OnInit {
  element!: any;
  modo!: string;
  mensajeAlert: string;
  alert!: boolean;
  estado!: string;
  cargando: boolean;
  nombreDirectorProyecto: string;


  formProyecto!: FormGroup;
  idProyecto!: number;
  directorProyecto: any ;
  usuariosDisponibles = [];
  itemList: any = [];
  selectedItems = [];
  settings = {};
  disabledForm: boolean;

  constructor(
    private getService: GetService,
    private postService: PostService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    public toastService: ToastServiceService,
    private logger: LogService
  ) { }

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  ngOnInit(): void {
    this.disabledForm = false;
    this.cargando = false;
    this.directorProyecto = JSON.parse(localStorage.getItem('usuario')).id;
    this.nombreDirectorProyecto = JSON.parse(localStorage.getItem('usuario')).nombre;
    this.getService.obtenerCandidatosProyecto().subscribe(res => {
      if (res){
        this.testLog("Candidatos obtenidos: ")
        this.testLog(res)
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
      nombre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      codigoProyecto: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      montoInicial: new FormControl(''),
      idDirectorProyecto: new FormControl(JSON.parse(localStorage.getItem('usuario')).id, [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      usuarios: new FormControl([], [Validators.required]),
      nomDirP: new FormControl(JSON.parse(localStorage.getItem('usuario')).nombre),
    });
    this.cargando = false;
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
      this.testLog("se van a enviar los sig datos : ")
      this.testLog(proyecto)
      this.postService.crearProyecto(proyecto).subscribe(res => {
        this.testLog(res);
          this.toastService.show('Proyecto Creado', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.disabledForm = false;
            this.volver();
          }, 2000);
          setTimeout(() => {
            this.toastService.removeAll()
          }, 3000);
        }, err => {
          let mensaje = err.error.Error[0]
          this.toastService.show('Problema al crear Proyecto' + mensaje , { classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
          }, 3000);
          this.disabledForm = false;
        });
    } 
  }

  volver(): void{
    let ruta = 'home/proyectos';
    this.router.navigateByUrl(ruta);
  }

}
