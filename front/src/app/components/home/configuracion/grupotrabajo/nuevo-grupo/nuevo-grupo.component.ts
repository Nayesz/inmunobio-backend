import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import { Usuario } from 'src/app/models/usuarios.model';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-nuevo-grupo',
  templateUrl: './nuevo-grupo.component.html',
  styleUrls: ['./nuevo-grupo.component.css']
})
export class NuevoGrupoComponent implements OnInit {
  modo: string;
  idGrupo: number;
  grupoTrabajo: any;
  formGrupo!: FormGroup;

  cargando: boolean;
  disabledForm: boolean;

  usuariosDisponibles : Usuario[] = [];
  jefesDeGrupo = [];

  itemList: any = [];
  selectedItems = [];
  settings = {};

  constructor(
    private getService: GetService,
    private postService: PostService,
    private router: Router,
    public toastService: ToastServiceService,
    private activatedRouter: ActivatedRoute
    ) { }

  jefesParaProyectos(){
    this.getService.obtenerJefesParaProyectos().subscribe(res => {
      this.jefesDeGrupo = res
    },(error) => {
      this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 2000 });
    })
  }

  tecnicosParaProyecto(){
    this.getService.obtenerCandidatosProyecto()
      .subscribe(res => {
        this.usuariosDisponibles = res
      },
      (error)=> {
        this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 2000 });
      }
    )
  }

  grupoDeTrabajoID(){
    this.idGrupo = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);

    this.getService.obtenerGrupoTrabajoPorId(this.idGrupo)
      .subscribe(res => {
        this.grupoTrabajo = res;
        console.log(JSON.stringify(this.grupoTrabajo, null, 4))
        
        this.formGrupo.patchValue({
          nombre: res.nombre,
          jefeGrupo: res.jefeDeGrupo.id,
          usuarios: res.integrantes,
        });
        this.cargando = false;
      },
      (error) => {
        this.toastService.show(error.error['Error'], { classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
    );
  }


  ngOnInit(): void {
    this.cargando = true;
    this.formGrupo = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      jefeGrupo: new FormControl(-1, [Validators.required]),
      usuarios: new FormControl([])
    });

    this.settings = {
      text: 'Seleccione usuarios pertenecientes al grupo',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id',
      labelKey: 'nombre',
      enableSearchFilter: true,
      searchBy: ['nombre'],
      disabled: false,
    };

    window.location.href.includes('editar') ? this.modo = 'EDITAR' : this.modo = 'CREAR';

    this.jefesParaProyectos()
    this.tecnicosParaProyecto()

    if ( this.modo === 'EDITAR'){
      this.grupoDeTrabajoID()
    }
    this.cargando = false;
    
    /*
    this.getService.obtenerUsuarios().subscribe(res => {
      if (res){
        this.itemList = res;
        this.usuariosDisponibles = res;
        this.jefesDeGrupo = res.filter(usuario => {
          return usuario.permisos.some(permiso => permiso.id_permiso === 3);
        });
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
      console.log(res);
    });*/
  }

  onItemRemove(usuarioEliminado) {
    this.usuariosDisponibles.push(usuarioEliminado)
  }

  crearGrupo(): void {
    this.disabledForm = true;
    this.settings = {
      text: 'Seleccione usuarios pertenecientes al grupo',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id',
      labelKey: 'nombre',
      enableSearchFilter: true,
      searchBy: ['nombre'],
      disabled: true,
    };

    const grupoTrabajo: any = {
      nombre: this.formGrupo.value.nombre,
      jefeDeGrupo: this.formGrupo.value.jefeGrupo,
      integrantes: this.formGrupo.value.usuarios.map(usuario => usuario.id)
    };

    if (this.modo === 'CREAR'){
        this.postService.crearGrupoTrabajo(grupoTrabajo).subscribe(res => {
          this.toastService.show('Grupo Creado', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => { 
            this.volver(); 
            this.toastService.removeAll()
          }, 2000);
      }, err => {
          console.log(err)
          this.toastService.show('Problema al crear grupo' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
          this.clearForm();
      });
    } else {
      grupoTrabajo.id_grupoDeTrabajo = this.idGrupo;
      this.postService.editarGrupoTrabajo(grupoTrabajo).subscribe(res => {
        this.toastService.show('Grupo Editado', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => { 
          this.volver(); 
          this.toastService.removeAll()
        }, 2000);
      }, err => {
        console.log(err)
        this.toastService.show('Problema al editar grupo ' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
        this.clearForm();
      });
    }
    // const int = [];
    // this.usuariosAsignados.map(usuario => {
    //   int.push(usuario.id_usuario);
    // });
    // if (this.modo === 'CREAR'){
    //   const grupoTrabajo = {
    //     nombre: this.formGrupo.value.nombre,
    //     jefeDeGrupo: this.formGrupo.value.jefeGrupo,
    //     integrantes: int,
    //   };
    //   this.postService.crearGrupoTrabajo(grupoTrabajo).subscribe(res => {
    //     console.log(res);
    //   });
    // } else {
    //   const editarGrupo = {
    //     id_grupoDeTrabajo: this.element.id_grupoDeTrabajo,
    //     integrantes: int
    //   };

    //   this.postService.editarGrupoTrabajo(editarGrupo).subscribe(res => {
    //     console.log(res);
    //   });

    //   const editarJefe = {
    //     id_grupoDeTrabajo: this.element.id_grupoDeTrabajo,
    //     jefeDeGrupo: JSON.parse(this.formGrupo.value.jefeGrupo)
    //   };

    //   console.log(editarJefe)
    //   this.postService.editarJefeGrupo(editarJefe).subscribe(res => {
    //     console.log(res);
    //   });
    // }
  }

  clearForm(): void {
    this.disabledForm = false;
    this.settings = {
      text: 'Seleccione usuarios pertenecientes al grupo',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id',
      labelKey: 'nombre',
      enableSearchFilter: true,
      searchBy: ['nombre'],
      disabled: false,
    };
  }

  volver(): void{
    this.router.navigateByUrl('home/configuracion/grupo-trabajo');
  }

}
