import { Component, OnInit } from '@angular/core';
import { Proyecto } from 'src/app/models/proyectos.model';
import { GetService } from 'src/app/services/get.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  filterPost: string;
  cargando: boolean;
  usuario: any;


  constructor(
    private getService: GetService,
    public toastService: ToastServiceService) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.cargando = true;
    this.filterPost = '';
    this.getService.obtenerProyectoPorUsuario(this.usuario.id).subscribe(res => {
      if (res) {
        this.proyectos = res;
        this.cargando = false;
      } else {
        this.proyectos = [];
        this.toastService.show('Hubo un error', { classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.cargando = false;
        }, 3000);
      }
    });
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
