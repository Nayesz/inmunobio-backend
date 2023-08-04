import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { GetService } from '../../../../services/get.service';
import { Subscription } from 'rxjs';
import { Distribuidora } from '../../../../models/distribuidora.model';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-distribuidoras',
  templateUrl: './distribuidoras.component.html',
  styleUrls: ['./distribuidoras.component.css']
})
export class DistribuidorasComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  distribuidoras: Distribuidora;
  cargando: boolean;
  id_dist = -1;
  disabledForm: boolean;

  constructor(
    private getService: GetService,
    private postService: PostService,
    public toastService: ToastServiceService,
    private modalService: NgbModal

  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.cargando = true;
    this.subscription.add(
      this.getService.obtenerDistribuidoras().subscribe(res => {
        if (res){
          this.distribuidoras = res;
          this.cargando = false;
        } else {
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);        }
      })
    );
  }

  open(content , id_dist_a_borrar): void {
    this.id_dist = id_dist_a_borrar;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  eliminar(): void{
      if(this.id_dist != -1){
        this.disabledForm = true;
        this.postService.eliminarDistribuidora(this.id_dist).subscribe(res =>{
          if (res.Status){
            this.toastService.show('Distribuidora Eliminada', { classname: 'bg-danger text-light', delay: 2000 });
            setTimeout(() => {
              this.toastService.removeAll()
              this.modalService.dismissAll()
              this.id_dist = -1;
              this.disabledForm = false;
            }, 2000);
          } else {
            this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
            setTimeout(() => {
              this.cargando = false;
              this.toastService.removeAll()
              this.id_dist = -1;
              this.disabledForm = false;
            }, 2000);
          }
        });
    }
  }

}
