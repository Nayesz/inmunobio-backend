import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { LogService } from 'src/app/services/log.service';


@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css'],
  providers: [DecimalPipe]
})
export class DetalleProyectoComponent implements OnInit {

  experimentos = [];
  experimentoFiltro = [];
  filter = new FormControl('');
  model: NgbDateStruct;
  model2: NgbDateStruct;
  proyecto: any;
  jefeProyecto: any;
  usuariosProyecto = [];
  idProyecto: number;
  active = 1;
  filterPostName: string;
  filterPostActive: number;
  fecHoy=new Date(Date.now());
  fecDesde:any;
  fecHasta:any;
  tipo:string = 'opc1';
  blogs = [];
  cargando: boolean;
  fecHastaReal: Date;
  usuario: any;
  constructor(
    private router: Router,
    private getService: GetService,
    private postService: PostService,
    private activatedRouter: ActivatedRoute,
    private modalService: NgbModal,
    public toastService: ToastServiceService,
    private logger: LogService

  ) {}

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.cargando = true;
    this.filterPostActive = -1;
    this.filterPostName = '';
    this.idProyecto = parseInt(this.activatedRouter.snapshot.paramMap.get('id'), 10);
    this.getService.obtenerProyectosPorId(this.idProyecto).subscribe(res => {
      if (res){
        this.proyecto = res;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 3000);
      }
      
    });

    this.getService.obtenerExperimentos(this.idProyecto).subscribe(res => {
      if (res){
        this.experimentos = res;
        this.experimentoFiltro = res;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 3000);
      }
    });
    
    this.fecHasta = new Date(this.fecHoy.getFullYear(),this.fecHoy.getMonth(),(this.fecHoy).getDate() + 1)
    this.fecHasta = this.fecHasta.toDateString();
    const blog : any = {
      id_proyecto: this.idProyecto,
      fechaDesde: 'Mon May 31 2021',
      fechaHasta: this.fecHasta
    }

    this.postService.obtenerBlogsProyecto(blog).subscribe(res =>{
      if (res){
        this.testLog("blogs obtenidos: ")
        this.testLog(res)
        this.blogs = res;
        this.cargando = false;
      } else {
        this.blogs=[];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 3000);
      }
    })
  }

  irA(id: number): void {
    this.router.navigateByUrl(`experimento/${id}`);
  }

  onFilter(filter: string): void {
    this.experimentoFiltro = this.experimentos.filter(res => {
      return res.objetivos === filter;
    });
  }

  open(content): void {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  Buscar(){
    this.fecDesde =  new Date(this.fecDesde.year,(this.fecDesde.month -1)  ,this.fecDesde.day)
    const fechaHasta = new Date(this.fecHasta.year,(this.fecHasta.month -1) ,this.fecHasta.day)
    const diaMas1 = (fechaHasta).getDate() + 2;
    this.fecHasta = new Date(fechaHasta.getFullYear(),fechaHasta.getMonth(), diaMas1)
    this.fecDesde = this.fecDesde.toDateString();
    this.fecHasta = this.fecHasta.toDateString();
    const blog : any = {
      id_proyecto : this.idProyecto,
      fechaDesde: this.fecDesde,
      fechaHasta: this.fecHasta
    }
    this.postService.obtenerBlogsProyecto(blog).subscribe(res =>{
      if (res){
        this.blogs = res;
        this.cargando = false;
      } else {
        this.blogs = [];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 3000);
      }})
        if (this.tipo == 'Jaula'){
          var filtrados= this.blogs.filter(blog => blog.tipo === 'Jaula')
          this.blogs=filtrados;
          
        } else if (this.tipo == 'Experimento'){
          var filtrados= this.blogs.filter(blog => blog.tipo === 'Experimento')
          this.blogs=filtrados;
        } 
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
