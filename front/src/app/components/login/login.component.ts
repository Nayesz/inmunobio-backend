import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from 'src/app/services/post.service';
import { JwtService } from 'src/app/services/jwt.service';
import { LogService } from 'src/app/services/log.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { throwError } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variables que afectan la alerta
  staticAlertClosed = false;
  successMessage: string;
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert;

  cargando: boolean;
  loginForm: FormGroup;


  constructor(
    private router: Router,
    private postService: PostService,
    private jwtService: JwtService,
    private logger: LogService
    ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
   }

  ngOnInit(): void {
    this.successMessage = '';
    this.cargando = false;
  }

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  login(): void{
    this.cargando = true;
    if (this.loginForm.controls.usuario.value === ''){
      this.successMessage = 'El usuario es requerido';
      this.cargando = false;
      return;
    }

    if (this.loginForm.controls.password.value === ''){
      this.successMessage = 'La contraseña es requerida';
      this.cargando = false;
      return;
    }

    this.postService.login({
        email: this.loginForm.controls.usuario.value,
        password: this.loginForm.controls.password.value
      })
      .pipe(
        catchError(error => {
          this.testLog(error + 'ahora siiii obtuvimos un error!!')       
          return throwError('Ocurrió un error en el proceso de login.');; // Devuelve un observable válido en caso de error
        }))
      .subscribe(res => {
          this.jwtService.login(res.token)
          setTimeout(() => {
            this.router.navigateByUrl('home/proyectos');
          }, 3000);
        }, err => {
          this.testLog('obtuvimos un error!!')       
          this.testLog(err)

          this.successMessage = err;
          this.cargando = false;
      });
  }
}
