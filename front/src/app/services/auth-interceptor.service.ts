import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtService } from './jwt.service';
import { LogService } from './log.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private helper = new JwtHelperService();
  constructor(private router: Router, private jwtService: JwtService, private logger: LogService
  ) { }


  testLog(mensaje): void {
    this.logger.log(mensaje);
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string;
    token = localStorage.getItem('token');
    let request = req;

    // SI EXISTE CONFIGURA HEADERS DE FUTURAS HTTP
    if (token) {
      console.log(token)
      request = req.clone({
        setHeaders: {
          Authorization: `${token}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigateByUrl('/login');
        }
        if (error.status === 400) {
          //this.router.navigateByUrl('/login');
          this.testLog("recibimos un error")
          this.testLog(error)

        }
        return throwError(error);
      })
    );
  }



}
