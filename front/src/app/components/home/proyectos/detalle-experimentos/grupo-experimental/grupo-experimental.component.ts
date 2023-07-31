import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { Fuente } from 'src/app/models/fuente.model'
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-grupo-experimental',
  templateUrl: './grupo-experimental.component.html',
  styleUrls: ['./grupo-experimental.component.css']
})
export class GrupoExperimentalComponent implements OnInit {
  idGrupo: number;
  idExperimento: number;
  idProyecto: number;
  grupoExperimental: any;
  animalesProyecto = [];
  formFuenteExperimentalAnimal: FormGroup;
  formFuenteExperimentalOtro: FormGroup;
  formMuestra: FormGroup;
  contenedores = [];
  muestrasFiltradas:any;
  animal:any;
  fuente:Fuente;
  fuenteOtro:any;

  jaulasProy:any;
  idJaulas:any;
  animales:any;

  idFuente:number;
  muestra:any;
  editar :any;
  datosFuente:any;
  disabledForm: boolean;
  filterPost:string;
  cargando:boolean;
  experimento:any;
  
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private postService: PostService,
    private getService: GetService,
    private modalService: NgbModal,
    public toastService: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.editar=false;
    this.cargando = true;
    this.filterPost = '';
    this.idGrupo = parseInt(this.activatedRouter.snapshot.paramMap.get('idGrupo'), 10);
    this.idExperimento = parseInt(this.activatedRouter.snapshot.paramMap.get('idExperimento'), 10);
    this.idProyecto = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);
    this.getService.obtenerExperimentoPorId(this.idExperimento).subscribe(res => {
      if (res){
        this.experimento = res;  
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
      }
    });
    this.getService.obtenerGruposExperimentalesPorId(this.idGrupo).subscribe(res => {
      if (res){
        this.grupoExperimental = res;  
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
        
      }
      console.log(res);
    });
    this.getService.obtenerContenedoresPorProyecto(this.idProyecto).subscribe(res => {
      if (res){
      this.contenedores = res;  
        this.cargando = false;
      } else {
        this.contenedores = [];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
     }
    })
    this.formFuenteExperimentalAnimal = new FormGroup({
      tipo: new FormControl(''),
      codigo: new FormControl('',Validators.required),
      animal: new FormControl('0',Validators.required)
    });
    this.formFuenteExperimentalOtro = new FormGroup({
      tipo: new FormControl(''),
      codigo: new FormControl(''),
      descripcion: new FormControl('')
    });
    this.formMuestra = new FormGroup({
      codigo: new FormControl(''),
      contenedor: new FormControl("0",Validators.required),
      descripcion: new FormControl('')
    });
    this.getService.obtenerAnimalesPorProyectos(this.idProyecto).subscribe(res => {
      if (res){
        res.Status ? this.animalesProyecto = [] : this.animalesProyecto = res;
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
      }
    });
  }

  open(content): void {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  crearFuenteAnimal(): void{
    this.disabledForm = true;
      const idAnimal = this.formFuenteExperimentalAnimal.value.animal
      this.getService.obtenerAnimalxId(idAnimal).subscribe( res =>{
        if (res){
          this.animal = res;
        } else {
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.cargando = false;
          }, 2000);
          
        }    
      })
      setTimeout(() => {
      this.fuente = {
        id_fuenteExperimental: this.animal.id_fuenteExperimental,
        id_proyecto: this.animal.id_proyecto,
        codigo: this.formFuenteExperimentalAnimal.value.codigo,
        codigoGrupoExperimental: this.grupoExperimental.codigo,
        especie: this.animal.especie,
        sexo: this.animal.sexo,
        cepa: this.animal.cepa,
        tipo : this.animal.tipo,
        id_jaula: this.animal.id_jaula,
        baja: this.animal.baja
      }
      const fuenteExperimental ={
        id_grupoExperimental : this.idGrupo,
        id_experimento: this.idExperimento,
        tipo: this.grupoExperimental.tipo,
        codigo: this.grupoExperimental.codigo,
        fuentesExperimentales : [this.fuente]
      }
      this.postService.crearFuenteExperimental(fuenteExperimental).subscribe(res => {
        console.log(res)
        if (res.Status === 'Se crearon las fuentes experimentales') {
          this.toastService.show('Fuente Experimental creada', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.ngOnInit()
          }, 2000);
        }
      }, err => {
        if(err.error.Error == "Los animales ya están en uso."){
          this.toastService.show('Error - el animal ya está en uso', { classname: 'bg-danger text-light', delay: 2000 });
          this.disabledForm = false;
          setTimeout(() => {
            this.toastService.removeAll()
          }, 3000);
        } else{
          this.toastService.show('Error '+ err.error.Error, { classname: 'bg-danger text-light', delay: 2000 });

          setTimeout(() => {
            this.toastService.removeAll()
            this.disabledForm = false;
          }, 2000);
        }
      })
    }, 1000);
  }
  crearFuenteOtro(){
    this.disabledForm = true;
      this.fuenteOtro={
        codigo: this.formFuenteExperimentalOtro.value.codigo,
        codigoGrupoExperimental: this.grupoExperimental.codigo,
        tipo : 'Otro',
        descripcion: this.formFuenteExperimentalOtro.value.descripcion
      }
      const fuenteExperimental ={
        id_grupoExperimental : this.idGrupo,
        id_experimento: this.idExperimento,
        tipo: this.grupoExperimental.tipo,
        codigo: this.grupoExperimental.codigo,
        fuentesExperimentales : [this.fuenteOtro]
      }
      this.postService.crearFuenteExperimental(fuenteExperimental).subscribe(res => {
        if (res.Status === 'Se crearon las fuentes experimentales') {
          this.toastService.show('Fuente Experimental creada', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.ngOnInit()
          }, 2000);
        }
      }, err => {
        this.toastService.show('Problema al crear la fuente experimental' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.disabledForm = false;
        }, 2000);        
      })
  }
  crearMuestra(): void{
    this.disabledForm = true;
    const obj : any = {
      id_proyecto : this.idProyecto,
      id_experimento : this.idExperimento,
      id_grupoExperimental : this.idGrupo,
      codigo : this.formMuestra.value.codigo,
      descripcion : this.formMuestra.value.descripcion,
      tipo : this.grupoExperimental.tipo,
      id_contenedor : parseInt(this.formMuestra.value.contenedor),
      id_fuenteExperimental: this.idFuente
    }
    if(this.editar){
      obj.id_muestra = this.muestra;
      this.postService.editarMuestra(obj).subscribe(res =>{
        if (res.Status === 'Se modificó la muestra'){
          this.toastService.show('Muestra editada', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.ngOnInit()
          }, 2000);
        }
      }, err => {
        this.toastService.show('Problema editar la muestra ' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.disabledForm = false;
        }, 2000);
        
      })
    } else {
      this.postService.crearMuestra([obj]).subscribe(res => {
        if (res.Status === 'Muestra creada'){
          this.toastService.show('Muestra creada', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.ngOnInit()
          }, 2000);
        }
        console.log(res);
      }, err => {
        this.toastService.show('Problema crear la muestra ' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.disabledForm = false;
        }, 2000);
       
      })
    } 
  }

  fuenteExpDetalle(idFuente, content){
    this.open(content)
    console.log(idFuente)
    this.idFuente = idFuente;
    this.getService.obtenerMuestrasPorIdFuente(idFuente).subscribe( res =>{
      this.muestrasFiltradas = res.filter(muestra => muestra.habilitada)
    })
    this.getService.obtenerFuenteExperimental(this.idFuente).subscribe(res =>{
      this.datosFuente = res;
    })
  }

  muestraModal(content,muestra){
    console.log(muestra)
    this.muestra = muestra.id_muestra;
    this.formMuestra.patchValue({
      codigo: muestra.codigo,
      contenedor: muestra.id_contenedor,
      descripcion: muestra.descripcion
    });
    if(muestra == 0){
      this.editar = false;
    } else {
      this.editar = true;
    }
    this.open(content)
  }
  eliminarMuestraAbrirModal(content,muestra){
    this.open(content)
    this.muestra = muestra 
  }
  eliminarMuestra(){
    this.disabledForm = true;
    this.postService.eliminarMuestra(this.muestra.id_muestra).subscribe(res =>{
      if(res.Status == 'Se dio de baja la muestra con id '+ this.muestra.id_muestra){
        this.toastService.show('Muestra eliminada', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.modalService.dismissAll()
          this.disabledForm = false;
          this.router.navigate(['/home/proyectos/'+this.idProyecto+'/experimento/'+this.idExperimento +'/grupo-experimental/'+ this.idGrupo]);
        }, 2000);
      }
    }, err => {
      this.toastService.show('Problema al eliminar la muestra ' + err.error.error, { classname: 'bg-danger text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
        this.disabledForm = false;
      }, 2000);
      
    })
  }
  eliminarGrupoExperimental(){
    this.disabledForm = true;
    this.postService.eliminarGrupoExperimental(this.idGrupo).subscribe(res =>{
      if( res.status === 200){
        this.toastService.show('Grupo Experimenal eliminado', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.modalService.dismissAll()
          this.disabledForm = false;
          this.router.navigate(['/home/proyectos/'+this.idProyecto+'/experimento/'+this.idExperimento]);
        }, 2000);
      }
    }, err => {
      let mensaje = err.error.Error[0];
      this.toastService.show('Problema al eliminar el Grupo ' + mensaje, { classname: 'bg-danger text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
        this.disabledForm = false;
      }, 2000);
    })
  }

}

