import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  usuario:any;
  formContenedor: FormGroup;
  disabledForm : Boolean = false
  constructor(
    private postService: PostService,
    public toastService: ToastServiceService,
  ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.crearForm()
  }

  crearForm(){
    this.formContenedor = new FormGroup({
      nombre: new FormControl(this.usuario.nombre, [Validators.required, Validators.maxLength(50)]),
      email: new FormControl(this.usuario.email, [Validators.required, Validators.maxLength(50)]),
      telefono: new FormControl(this.usuario.telefono, [Validators.maxLength(100)]),
      direccion : new FormControl(this.usuario.direccion, [Validators.maxLength(100)]),
    });
  }

  crearContenedor(){
    this.usuario.nombre = this.formContenedor.value.nombre
    this.usuario.email = this.formContenedor.value.email
    this.usuario.telefono = this.formContenedor.value.telefono
    this.usuario.direccion = this.formContenedor.value.direccion
    delete this.usuario.exp
    
    this.postService.editarUsuario(this.usuario)
      .subscribe(res => {
        this.toastService.show('Se modificó el usuario.', { classname: 'bg-success text-light', delay: 2000 });
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
      },
      (error)=>{
        this.toastService.show(error.error['Error'],{ classname: 'bg-danger text-light', delay: 2000 });
      }
    )

  }

}
