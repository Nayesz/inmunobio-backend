import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  usuario:any;
  constructor(
    private logger: LogService
  ) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  esSuperUsuario(){
    for(let i = 0 ; i < this.usuario.permisos.length ; i++){
      if (this.usuario.permisos[i].id_permiso == 1){
        return true;
      }  
    }
      return false;
    }
    
  

}

