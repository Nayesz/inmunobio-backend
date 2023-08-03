import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuarios.model';
import { GetService } from 'src/app/services/get.service';
import { LogService } from 'src/app/services/log.service';
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
    private activatedRouter: ActivatedRoute,
    private logger: LogService
    ) { }
    
    testLog(mensaje): void {
      this.logger.log(mensaje);
    }
  
    ngOnInit(): void {
      this.cargando = true;
      this.formGrupo = new FormGroup({
        nombre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        jefeGrupo: new FormControl(-1, [Validators.required]),
        usuarios: new FormControl([],[Validators.required])
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
      this.candidattosParaGrupo()
  
      if ( this.modo === 'EDITAR'){
        this.testLog("ESTAMOS EN MODO EDICION")
        this.grupoDeTrabajoID()
      }
      this.cargando = false;
      
    }
  
  jefesParaProyectos(){
    this.getService.obtenerJefesParaProyectos().subscribe(res => {
      this.jefesDeGrupo = res
    },(error) => {
      this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 2000 });
    })
  }

  candidattosParaGrupo(){
    this.getService.candidattosParaGrupo()
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
        this.testLog(res)
        console.log(JSON.stringify(this.grupoTrabajo, null, 4))
        
        for (const integrante of res.integrantes) {
          //Si no se agregan a la lista de disponibles, entonces no puedo ver usuarios 
          //que ya estan en el grupo.
          this.usuariosDisponibles.push(integrante)
        }
        
        this.jefesDeGrupo.push(res.jefeDeGrupo)

        this.formGrupo.patchValue({
          nombre: res.nombre,
          jefeGrupo: res.jefeDeGrupo.id,
          usuarios: res.integrantes
        });
        this.cargando = false;
      },
      (error) => {
        this.toastService.show(error.error['Error'], { classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
    );
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
          this.toastService.show('Problema al crear grupo: ' + err.error['Error'], { classname: 'bg-danger text-light', delay: 2000 });
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
        this.toastService.show('Problema al editar grupo: ' + err.error['Error'], { classname: 'bg-danger text-light', delay: 2000 });
        this.clearForm();
      });
    }

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
