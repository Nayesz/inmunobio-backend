import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { GetService } from '../../../../services/get.service';
import { Usuario } from '../../../../models/usuarios.model';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  usuariosTodos: Usuario[];
  permisos = [];
  cargando: boolean;
  idUserAEliminar = -1;
  usuarioSeleccionado: Usuario;
  page: number;
  pageSize: number;
  collectionSize: number;
  disabledForm: boolean;

  constructor(
    private getService: GetService,
    private postService: PostService,
    public toastService: ToastServiceService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.disabledForm = true;
    this.page = 1;
    this.pageSize = 10;
    this.obtenerUsuarios();
  }

  obtenerUsuarios() : void {
    this.cargando = true;
    this.disabledForm = true;
    this.getService.obtenerUsuarios().subscribe(res => {
      if (res){
        this.usuariosTodos = res;
        this.usuarios = res;
        this.collectionSize = res.length;
        this.refreshUsers();
        this.cargando = false;
        this.disabledForm = false;
      } else {
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll(),
          this.cargando = false;
          this.disabledForm = false;
        }, 2000);
      }
    });
  }

  
  open(content , id_dist_a_borrar): void {
    this.idUserAEliminar = id_dist_a_borrar;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }


  eliminar(): void{
    
    if(this.idUserAEliminar != -1){
      this.disabledForm = true;
      this.postService.eliminarUsuario(this.idUserAEliminar).subscribe(
        (res) => {
          if (res.Status){
            this.toastService.show('Usuario Eliminado', { classname: 'bg-danger text-light', delay: 2000 });
            this.modalService.dismissAll() 
            this.idUserAEliminar = -1
            this.disabledForm = false;
            this.obtenerUsuarios();
          } else {
            this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
            setTimeout(() => {
              this.toastService.removeAll(),
              this.idUserAEliminar = -1,
              this.cargando = false;
            }, 3000);
            this.disabledForm = false;
          }
      },(err) =>{
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll(),
            this.idUserAEliminar = -1,
            this.cargando = false;
          }, 3000);
          this.disabledForm = false;
      }

      
      );
    }
  }

  refreshUsers(): void {
    this.usuarios = this.usuariosTodos
      .map((user, i) => ({id: i + 1, ...user}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
