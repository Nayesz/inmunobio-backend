import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GetService } from 'src/app/services/get.service';
import { PostService } from 'src/app/services/post.service';
import { Producto } from 'src/app/models/producto.model'
import { ProductoEdic, ProductoStock, Stock, StockEdicion } from 'src/app/models/stock.model';
import { Contenedor } from 'src/app/models/contenedores.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, JsonPipe } from '@angular/common';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-agregar-stock',
  templateUrl: './agregar-stock.component.html',
  styleUrls: ['./agregar-stock.component.css'],
  providers: [DatePipe]
})

export class AgregarStockComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  usuario:any;
  productos: Producto[] = [];
  contenedores: Contenedor[] = [];
  contenedoresEspecificos: Contenedor[]=[];
  
  
  formStock!: FormGroup;

  idEspacioFisico:number;
  idProd:number;
  idProdEnStock:number;
  idUbicacion:number;
  stocks:Stock[]=[];
  stockProducto:Stock;
  prodEspecifico:any;
  modoEditar = false;
  cargando: boolean;
  disabledForm: boolean = false;
 
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private getService: GetService,
    private postService: PostService, 
    public datepipe: DatePipe,
    public toastService: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.idEspacioFisico = parseInt(this.activatedRouter.snapshot.paramMap.get('idEspacio'), 10);
    this.idProd = parseInt(this.activatedRouter.snapshot.paramMap.get('idProducto'), 10);
    this.idProdEnStock = parseInt(this.activatedRouter.snapshot.paramMap.get('idProductoEnStock'), 10);
    this.idUbicacion = parseInt(this.activatedRouter.snapshot.paramMap.get('idUbicacion'), 10);
    const idGrupoTrabajo = this.usuario.id_grupoDeTrabajo

    if(this.esUnaModificacionDeStockDelProducto()){
      this.getStock(idGrupoTrabajo)
      this.modoEditar = true;
    }

    this.getProducto()
    this.getContenedores()

    this.inicializarForm()
    this.cargando = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  inicializarForm(): void{
    this.formStock = new FormGroup({
      producto: new FormControl('0', [Validators.required]),
      lote: new FormControl('', [Validators.maxLength(50)]),
      unidad: new FormControl('', [Validators.required, Validators.pattern(/^[0-9][0-9]*$/), Validators.min(1)]),
      contenedor: new FormControl('0', [Validators.maxLength(30)]),
      detalleUbicacion: new FormControl('', [Validators.maxLength(50)]),
      fechaVencimiento: new FormControl('', [ this.validateFechaVencimiento(), Validators.required]),
      seguimiento: new FormControl(false)
    });
  }

  validateFechaVencimiento(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; 
      }
      const fechaVencimiento = new Date(value);
      const hoy = new Date();
      if (fechaVencimiento <= hoy) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }

  actualizarForm(): void{
    this.formStock.patchValue({
      producto: this.stockProducto.id_producto,
      lote: this.prodEspecifico.lote,
      unidad: this.prodEspecifico.unidad,
      contenedor: this.prodEspecifico.codigoContenedor,
      detalleUbicacion: this.prodEspecifico.detalleUbicacion,
      fechaVencimiento: this.datepipe.transform(this.prodEspecifico.fechaVencimiento, 'yyyy-MM-dd'),
      seguimiento: this.stockProducto.seguimiento
    });
    this.formStock.controls['producto'].disable();
    this.formStock.controls['unidad'].disable();
  }

  esUnaModificacionDeStockDelProducto = (): boolean => {return !isNaN(this.idProd)}

  getStock(idGrupoTrabajo : number) : void {
    this.cargando = true;
    this.getService.obtenerStock(idGrupoTrabajo, this.idEspacioFisico)
    .subscribe
    (
      (res) => {
        this.stocks = res;
        this.cargando = false;
        this.stockProducto = this.stocks.find(stock => (stock.id_producto = this.idProd) && (stock.id_productoEnStock == this.idProdEnStock))
        this.prodEspecifico = this.stockProducto.producto[this.idUbicacion]
        this.actualizarForm()
      },
      (error) => {
        const errorRecived = error.error['Error'];
        this.cargando = true;
        this.toastService.show(errorRecived,{ classname: 'bg-danger text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
        }, 2000);
      }
    )
  }

  getProducto() : void {
    this.cargando = true;
    this.subscription.add(this.getService.obtenerProductos()
      .subscribe
      (
        (res) => {
          this.productos = res;
          this.cargando = false;

        },
        (error) => {
          this.productos = [];
          const errorRecived = error.error['Error'];
          this.toastService.show(errorRecived,{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);
        }
      )
    );
  }

  getContenedores() : void {
    this.cargando = true;
    this.subscription.add(this.getService.obtenerContenedores()
      .subscribe
      (
        (res) => {
          this.contenedores = res.filter( contenedor => contenedor.id_espacioFisico == this.idEspacioFisico);
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);
        },
        (error) => {
          this.contenedores = [];
          const errorRecived = error.error['Error'];
          this.toastService.show(errorRecived,{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);
        }
      )
    );
  }

  agregarStock() : void {
    this.cargando = true;
    this.disabledForm = true;
    if (this.esUnaModificacionDeStockDelProducto()){
      this.editarProductoDelStock()
    }
    else {
      this.agregarNuevoProductoAlStock()
    }
  }

  editarProductoDelStock() : void {
    const edicion : StockEdicion = {
      id_productoEnStock: this.stockProducto.id_productoEnStock,
      producto: {
        codigoContenedor: this.formStock.value.contenedor,
        detalleUbicacion : this.formStock.value.detalleUbicacion,
        unidad : 0,
        lote : this.formStock.value.lote,
        id_productos : this.prodEspecifico.id_productos,
        fechaVencimiento: this.datepipe.transform(this.formStock.value.fechaVencimiento, 'yyyy-MM-ddT00:00:0.000Z'),
      },
      seguimiento : this.formStock.value.seguimiento
    }
    this.subscription.add(this.postService.editarStock(edicion)
      .subscribe(
        (res) => {
          this.toastService.show('Información editada ', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.volver()
            this.toastService.removeAll()
          }, 2000);

        }, 
        (error) => {
          this.toastService.show('Problema al editar la información '+ error.error['Error'], { classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);
        }
      )
    );

  }

  agregarNuevoProductoAlStock() : void {
    const fecha = this.formStock.value.fechaVencimiento;

    const stock : Stock = {
      id_grupoDeTrabajo : 1 ,
      id_espacioFisico : this.idEspacioFisico ,
      id_producto: this.formStock.value.producto,
      seguimiento: this.getEstadoCheckbox(),
      producto: {
        lote: this.formStock.value.lote,
        unidad: this.formStock.value.unidad,
        codigoContenedor: this.formStock.value.contenedor,
        detalleUbicacion: this.formStock.value.detalleUbicacion,
        fechaVencimiento: this.datepipe.transform(fecha, 'yyyy-MM-ddT00:00:00.000Z'),
        nombreContenedor: this.formStock.value.nombreContenedor
      }
    };
    
    this.subscription.add(this.postService.agregarStock(stock)
      .subscribe(
        (res) => {
          this.toastService.show('Producto en stock agregado correctamente ', { classname: 'bg-success text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
            this.volver()
          }, 2000);        }, 
        (error) => {
          const errorRecived = error.error['Error'];
          this.toastService.show('Problema al agregar producto en stock.\r\nError: ' + errorRecived, { classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.cargando = false;
            this.toastService.removeAll()
          }, 2000);
        }
      )
    );
  }

  getEstadoCheckbox() {
    return this.formStock.get('seguimiento').value;
  }
  volver(): void {
    this.router.navigateByUrl('home/stock/'+ this.idEspacioFisico);
  }


}

