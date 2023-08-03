import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-grupotrabajo',
  templateUrl: './grupotrabajo.component.html',
  styleUrls: ['./grupotrabajo.component.css']
})
export class GrupotrabajoComponent implements OnInit {

  gruposTrabajo = [];

  grupoSeleccionado: any;
  step: number;
  modo: string;
  cargando: boolean;
  usuario : any;


  constructor(
    private getService: GetService, 
    private postService: PostService,
    private router: Router,
    public toastService: ToastServiceService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getService.obtenerGruposCorrespondientesA(this.usuario['id']).subscribe(
      (res) => {
        this.gruposTrabajo = res;
        this.cargando = false;
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

  eliminarGrupo(grupo: any): void{
    this.postService.eliminarGrupoTrabajo(grupo.id_grupoDeTrabajo).subscribe(res =>{
      if (res.Status){
        this.toastService.show('Grupo Eliminado', { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
        }, 2000);
      }else{
        this.toastService.show('Ocurrio un error', { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => { 
          this.toastService.removeAll() 
        }, 2000);
      }
      
    })
  }

  onVolver(e: number): void{
    this.step = e;
  }

}
