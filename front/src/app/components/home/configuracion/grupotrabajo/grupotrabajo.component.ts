import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-grupotrabajo',
  templateUrl: './grupotrabajo.component.html',
  styleUrls: ['./grupotrabajo.component.css']
})
export class GrupotrabajoComponent implements OnInit {

  gruposTrabajo = [];
  id_grupo_a_borrar: -1;
  grupoSeleccionado: any;
  step: number;
  modo: string;
  cargando: boolean;
  usuario : any;
  disabledForm: boolean;

  constructor(
    private getService: GetService, 
    private postService: PostService,
    private router: Router,
    private modalService: NgbModal,
    public toastService: ToastServiceService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.disabledForm = true;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getService.obtenerGruposCorrespondientesA(this.usuario['id']).subscribe(
      (res) => {
        this.gruposTrabajo = res;
        this.cargando = false;
        this.disabledForm = false;

      },(error) => {
        this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 1500 });
        console.log()
        setTimeout(() => {
          this.cargando = true;
          this.refreshPage()  
        }, 1500);
        
      }
    );
  }
  open(content , id_grupo): void {
    this.id_grupo_a_borrar = id_grupo;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  refreshPage() {
    this.router.navigateByUrl('/home/configuracion', { skipLocationChange: false }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }

  editarGrupo(grupo: any): void{
    this.grupoSeleccionado = grupo;
    this.modo = 'EDITAR';
    this.step = 1;
  }

  crearGrupo(): void{
    this.modo = 'CREAR';
    this.step = 1;
  }

  eliminarGrupo(): void{
    if(this.id_grupo_a_borrar != -1){
      this.disabledForm = true;
      this.postService.eliminarGrupoTrabajo(this.id_grupo_a_borrar).subscribe(
        (res) =>{
          if (res.Status){
            this.toastService.show('Grupo Eliminado', { classname: 'bg-danger text-light', delay: 2000 });
            setTimeout(() => {    
              this.id_grupo_a_borrar = -1;
              this.toastService.removeAll();
              this.disabledForm = false;
              this.modalService.dismissAll();
            }, 2000);
          }
        },(error) => {
          this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 1500 });
          setTimeout(() => { 
            this.id_grupo_a_borrar = -1;
            this.toastService.removeAll();
            this.modalService.dismissAll();
            this.disabledForm = false;
          }, 2000);
        });
    }
    }
      

  onVolver(e: number): void{
    this.step = e;
  }

}
