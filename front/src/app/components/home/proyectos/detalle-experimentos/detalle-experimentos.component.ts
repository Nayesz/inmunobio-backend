import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-detalle-experimentos',
  templateUrl: './detalle-experimentos.component.html',
  styleUrls: ['./detalle-experimentos.component.css']
})
export class DetalleExperimentosComponent implements OnInit {
  
  idProyecto!: number;
  idExperimento!: number;
  proyecto: any;
  experimento: any;
  gruposExperimentales = [];
  formGrupoExperimental: FormGroup;
  formAsociarMuestra: FormGroup;
  agregarGrupo: boolean;
  detalleBlog: string;
  fechaHoy: any;
  fechaDesde: any;
  fechaHasta: any;
  blogs = [];
  filterPost:string;
  filterPostMuestra:string;
  filterPostActive: number;
  muestrasDisponibles:any;
  fecHoy=new Date(Date.now());
  fecDesde:any;
  fecHasta:any;
  disabledForm: boolean;
  cargando:boolean;
  usuario:any;
  itemList: any = [];
  selectedItems = [];
  settings:any;
  constructor(
    private activatedRouter: ActivatedRoute,
    private getService: GetService,
    private postService: PostService,
    private modalService: NgbModal,
    public toastService: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
    this.cargando = true;
    this.filterPost = '';
    this.filterPostMuestra = '';
    this.filterPostActive = -1;
    this.agregarGrupo = false;
    this.formGrupoExperimental = new FormGroup({
      tipo: new FormControl('0', Validators.required),
      codigo: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
    });
    this.formAsociarMuestra = new FormGroup({
      muestras: new FormControl('0', Validators.required)
    });
    
    this.idProyecto = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);
    this.idExperimento = parseInt(this.activatedRouter.snapshot.paramMap.get('idExperimento'), 10);
    this.getService.obtenerProyectos().subscribe(res => {
      if (res){
        this.proyecto = res;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
      }
    });
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
    
    this.getService.obtenerGruposExperimentalesPorExperimento(this.idExperimento).subscribe(res => {
      if (res){
        res === null ? this.gruposExperimentales = [] : this.gruposExperimentales = res;
        this.gruposExperimentales = this.gruposExperimentales.filter( grupo => grupo.habilitado)
        this.cargando = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
      }
    });

    this.fechaDesde = new Date();
    this.fechaDesde.setDate(this.fechaDesde.getDate() - 3);
    this.fechaHasta = new Date();

    this.postService.obtenerBlogExperimento({
      id_experimento: this.idExperimento,
      fechaDesde: this.fechaDesde.toDateString(),
      fechaHasta: this.fechaHasta.toDateString()
    }).subscribe(res => {
      if (res){
        this.blogs = res;
      } else {
        this.blogs = [];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 2000);
      }
      
    });
    setTimeout(() => {
      this.getService.obtenerMuestrasCandidatasExt(this.idProyecto,this.idExperimento).subscribe(res =>{
        if(res){
          const muestrasAsociadas = this.experimento.muestrasExternas.map(a => a.id_muestra)
          this.itemList = res.filter( b => { return !muestrasAsociadas.includes(b.id_muestra)})
          this.cargando = false;
        } else {
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.cargando = false;
          }, 2000);
        }
      })
    }, 500);
    this.settings = {
      text: 'Seleccione muestras a asociar',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id_muestra',
      labelKey: 'codigo',
      enableSearchFilter: true,
      searchBy: ['codigo'],
      disabled: false,
    };
  }

  crearGrupoExperimental(): void {
    this.disabledForm = true;
    const grupoExperimental = this.formGrupoExperimental.value;
    grupoExperimental.id_experimento = this.idExperimento;
    console.log(grupoExperimental)
    this.postService.crearGrupoExperimental(grupoExperimental).subscribe(res => {
      this.toastService.show('Grupo Experimental creado', { classname: 'bg-success text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
        this.modalService.dismissAll()
        this.disabledForm = false;
        this.ngOnInit()
      }, 2000);

    }, err => {
      this.toastService.show('Problema al crear Grupo Experimental' + err, { classname: 'bg-danger text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
        this.modalService.dismissAll()
        this.disabledForm = false;
      }, 2000);
    });
  }

  open(content,centered): void {
    this.modalService.open(content, { centered: centered, size: 'lg' });
  }

  crearBlog(): void{
    this.disabledForm = true;
    const Blog: any = {
      id_usuario: this.usuario.id ,
      detalle: this.detalleBlog,
      tipo: 'Experimento'
    };
    const nuevoBlog: any = {
      id_proyecto: this.idProyecto,
      id: this.idExperimento,
      blogs: Blog
    };
    this.postService.crearBlogProyecto(nuevoBlog).subscribe(res => {
      if (res){
        this.toastService.show('Blog creado', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.detalleBlog = '';
            this.ngOnInit()
          }, 2000);
      }
    }, err => {
      this.toastService.show('Problema al crear el blog', { classname: 'bg-danger text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
      }, 2000);
    });
  }

  filtrarBlogs(): void{
    this.fecDesde =  new Date(this.fecDesde.year,(this.fecDesde.month -1)  ,this.fecDesde.day)
    const fechaHasta = new Date(this.fecHasta.year,(this.fecHasta.month -1) ,this.fecHasta.day)
    const diaMas1 = (fechaHasta).getDate() + 2;
    this.fecHasta = new Date(fechaHasta.getFullYear(),fechaHasta.getMonth(), diaMas1)
    this.fecDesde = this.fecDesde.toDateString();
    this.fecHasta = this.fecHasta.toDateString();
    const blog : any = {
      id_experimento : this.idExperimento,
      fechaDesde: this.fecDesde,
      fechaHasta: this.fecHasta
    }
    this.postService.obtenerBlogExperimento(blog).subscribe( res =>{
      this.blogs = res;
    })
  }
  asociarMuestraExperimento(){
    this.disabledForm = true;
    this.settings = {
      text: 'Seleccione muestras a asociar',
      selectAllText: 'Seleccione Todos',
      unSelectAllText: 'Quitar Todos',
      classes: 'myclass custom-class',
      primaryKey: 'id_muestra',
      labelKey: 'codigo',
      enableSearchFilter: true,
      searchBy: ['codigo'],
      disabled: true,
    };
    const fuentesSeleccionadas = this.formAsociarMuestra.value.muestras
    const muestrasAsociadas = this.experimento.muestrasExternas
    const todasLasMuestras = muestrasAsociadas.concat(fuentesSeleccionadas)
    const datosMuestra:any={
      id_proyecto: this.idProyecto,
      id_experimento: this.idExperimento,
      muestrasExternas: todasLasMuestras
    }
    this.postService.agregarMuestraExternaExperimento(datosMuestra).subscribe(res =>{
      if (res.Status){
        this.toastService.show('Se agregaron las muestras al experimento.', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.modalService.dismissAll()
            this.disabledForm = false;
            this.selectedItems = [];
            this.ngOnInit()
          }, 2000);
      }
    }, err => {
      this.toastService.show('Problema al asociar las muestras', { classname: 'bg-danger text-light', delay: 2000 });
      setTimeout(() => {
        this.toastService.removeAll()
        this.modalService.dismissAll()
      }, 2000);
    })
  }


  esDirProyecto() {
    for (let i = 0; i < this.usuario.permisos.length; i++) {
      if (this.usuario.permisos[i].id_permiso == 4) {
        return true;
      }
    }
    return false;
  }
}
