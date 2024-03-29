import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../../../../services/post.service';
import { GetService } from '../../../../services/get.service';
import { Producto } from '../../../../models/producto.model';
import { Consumir, ProductoStock, Stock } from '../../../../models/stock.model';
import { ActivatedRoute } from '@angular/router';
import { BlogBuscados, BlogsBuscadosEspFisico, BlogsBuscadosHerr } from 'src/app/models/blogs.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EspacioFisico } from 'src/app/models/espacioFisico.model';
import { Herramienta } from 'src/app/models/herramientas.model';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { Usuario } from 'src/app/models/usuarios.model';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-stock-detalle',
  templateUrl: './stock-detalle.component.html',
  styleUrls: ['./stock-detalle.component.css']
})
export class StockDetalleComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  usuario:Usuario;
  stocks: Stock[] =[];
  productos: Producto[]=[];
  espacioFisico:EspacioFisico;
  herramientasFiltradas: Herramienta[] =[];
  idEspacioFisico:number;
  
  fecDesde:any;
  fecHasta:any;
  blogs : BlogBuscados[] =[];

  idProductoStock:any;
  idProducto:any;
  herramienta:Herramienta;
  prodEspecifico:ProductoStock;
  cantidad:number;
  idHerramienta_eliminar:number;
  tipo = 'opc1';
  herramientaSeleccionada:number ;

  filtroFechaVenc:any;
  filterPost: string;
  filterPost2: string;
  cargando:boolean;
  disabledForm: boolean;
  
  constructor(
    private activatedRouter: ActivatedRoute,
    private getService: GetService,
    private postService: PostService,
    private modalService: NgbModal,
    private logger: LogService,
    public toastService: ToastServiceService
  ) { }

  testLog(mensaje): void {
    this.logger.log(mensaje);
  }

  ngOnInit(): void {
    this.cargando = true;
    this.filterPost ='';
    this.filterPost2 ='';
    this.filtroFechaVenc = '-1';
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    const idGrupoTrabajo = this.usuario.id_grupoDeTrabajo
    this.idEspacioFisico = parseInt(this.activatedRouter.snapshot.paramMap.get('idEspacio'), 10);
    console.log("Espacio físico " + this.idEspacioFisico);
    //STOCK
    console.log("Id Grupo: " + idGrupoTrabajo)
    console.log("Id espacio físico: " + this.idEspacioFisico)
    if(idGrupoTrabajo > 0){
      this.subscription.add(
        this.getService.obtenerStock(idGrupoTrabajo, this.idEspacioFisico).subscribe(
          (res) => {
            console.log("Ingresó")
            this.stocks = res;
            this.cargando = false;
          },
          //TO-DO: Acá se captura el error, pero por alguna razón sigue apareciendo el 400 en la consola
          (error) => {
            console.log(`Error: ${error.error['Error']}`);
            this.cargando = false;
          }
        )
      );
    }
    

    this.subscription.add( this.getService.obtenerEspacioFisico(this.idEspacioFisico).subscribe(res => {
      if(res){
        this.espacioFisico = res; 
        this.cargando = false;
      } else{
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
      console.log(res);
    })
    );
    this.subscription.add( this.getService.obtenerProductos().subscribe(res => {
      if(res){
        this.productos = res ;
        this.cargando = false;
      } else{
        this.productos= [];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
       })
    );
    //BLOGS 
    const hoy = new Date(Date.now());
    const dia = (hoy).getDate() + 1;
    this.fecHasta = new Date(hoy.getFullYear(),hoy.getMonth(), dia)
    this.fecHasta = this.fecHasta.toDateString();
    const blog : BlogsBuscadosEspFisico = {
          id_espacioFisico: this.idEspacioFisico,
          fechaDesde: 'Mon May 31 2021',
          fechaHasta: this.fecHasta
        } 
    this.subscription.add(this.postService.obtenerBlogEspacioFisico(blog).subscribe(res =>{
      if(res){
        this.blogs = res;
        this.cargando = false;
      } else{
        this.blogs = [];
        this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
        this.cargando = false;
      }
      console.log(res);
       })
    );
    //HERRAMIENTAS
    console.log("se va a ejecutar obtenerHerramientas")
    this.subscription.add( this.getService.obtenerHerramientas().subscribe(res => {
      console.log("Entró al subscribe de herramientas")
      this.cargando = false;
      this.herramientasFiltradas =  res.filter(herramienta => {
        return herramienta.id_espacioFisico == this.idEspacioFisico;
      })},
       (error) => {
        console.log("Error en herramientas: " + error.error['Error'])
        this.cargando = false
       }
    ));
  }

  open(content, size): void {
    this.modalService.open(content, { centered: true, size: size });
  }
  Buscar(){
    this.testLog("vamos a buscar blogs!")
    this.fecDesde =  new Date(this.fecDesde.year,(this.fecDesde.month -1)  ,this.fecDesde.day)
    const fechaHasta = new Date(this.fecHasta.year,(this.fecHasta.month -1) ,this.fecHasta.day)
    this.testLog(this.fecDesde)
    this.testLog(fechaHasta)
    const diaMas1 = (fechaHasta).getDate() + 2;
    this.fecHasta = new Date(fechaHasta.getFullYear(),fechaHasta.getMonth(), diaMas1)
    this.fecDesde = this.fecDesde.toDateString();
    this.fecHasta = this.fecHasta.toDateString();
    if(this.tipo == 'herramienta'){
      this.testLog("de tipo herramienta!")
      const blog: BlogsBuscadosHerr ={
        id_herramienta: this.herramientaSeleccionada,
        fechaDesde: this.fecDesde,
        fechaHasta: this.fecHasta
      }
      this.subscription.add(this.postService.obtenerBlogHerramientas(blog).subscribe(res =>{
        if(res){
          this.testLog("OBTUVIMOS RESP :)")
          this.testLog(res)
          this.blogs = res;
          this.cargando = false;
        } else{
          this.blogs = [];
          this.testLog("error...")
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.cargando = false;
          }, 2000);
        }
        console.log(res);
      })
      );
    } else {
      this.testLog("de tipo esp fisico!")
      const blog : BlogsBuscadosEspFisico = {
        id_espacioFisico: this.idEspacioFisico,
        fechaDesde: this.fecDesde,
        fechaHasta: this.fecHasta
      }
      this.subscription.add(this.postService.obtenerBlogEspacioFisico(blog).subscribe(res =>{
        if(res){
          this.blogs = res;
          this.cargando = false;
        } else{
          this.blogs = [];
          this.toastService.show('Hubo un error',{ classname: 'bg-danger text-light', delay: 2000 });
          setTimeout(() => {
            this.toastService.removeAll()
            this.cargando = false;
          }, 2000);
        }
        console.log(res);
       })
      );
    }
  }
  eliminarP(id_ProductoEnStock,id_Producto,content){
    this.open(content,'lg');
    this.idProductoStock = id_ProductoEnStock.id_productoEnStock; // TODO PROD-STOCK
    this.idProducto = id_ProductoEnStock.producto[id_Producto].id_productos; // TODO ID PROD
  }

  eliminarStockModal(){
    this.disabledForm = true;
    const id_productoEnStock= this.idProductoStock  // TODO PROD-STOCK
    const id_productos =  this.idProducto // TODO ID PROD
    this.subscription.add( this.postService.eliminarStock(this.idProductoStock, this.idProducto).subscribe(res =>{
      if (res.Status === 'Se borró el producto en stock.'){
        this.toastService.show('Stock eliminado', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.modalService.dismissAll()
          this.disabledForm = false;
          this.ngOnInit()
        }, 1000);
      }
    }, err => {
      this.toastService.show('Problema al eliminar el stock' + err.error.Error, { classname: 'bg-danger text-light', delay: 2000 });
      console.log(err)
      setTimeout(() => {
        this.modalService.dismissAll()
        this.toastService.removeAll()
        this.disabledForm = false;
      }, 4000);
    }));
  }

  VerHerramienta(datosHerramienta,content){
    this.open(content,'xl');
    this.herramienta = datosHerramienta; // TODO HERRAMIENTA
  }
  consumirP(id_ProductoStock,id_Producto,content){
    this.open(content,'lg');
    this.idProductoStock= id_ProductoStock; //TODO PROD-STOCK
    this.idProducto = id_Producto; //TODO ID PROD
    setTimeout(() => {
      const producto = this.stocks.find(stock => (stock.id_producto == this.idProductoStock.id_producto) && (stock.id_productoEnStock == this.idProductoStock.id_productoEnStock))
      console.log(producto)
      this.prodEspecifico = producto.producto[this.idProducto]
      console.log(this.prodEspecifico)
    }, 500);
  }
  consumirStockModal(){
    this.disabledForm = true;
    const consumir : Consumir ={
      unidad: this.cantidad,
      id_productoEnStock : this.idProductoStock.id_productoEnStock, //TODO PROD-STOCK
      id_productos: this.prodEspecifico.id_productos
    }
    this.subscription.add(this.postService.consumirStock(consumir).subscribe(res =>{
      if (res.Status === 'Se modificaron las unidades del producto en stock.'){
        this.toastService.show('Stock consumido', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.modalService.dismissAll()
          this.disabledForm = false;
          this.cantidad = 0;
          this.ngOnInit()
        }, 2000);
      }
        console.log(res)
      }, err => {
        this.toastService.show( 'La cantidad solicitada no se encuentra en stock', { classname: 'bg-danger text-light', delay: 2000 });
        console.log(err)
        setTimeout(() => {
          this.toastService.removeAll()
          this.disabledForm = false;
        }, 3000);
      }));
  }

  eliminarHModal(id,content){
    this.open(content,'lg');
    this.idHerramienta_eliminar = id;
  }
  eliminarH(){
    this.disabledForm = true;
    console.log(this.idHerramienta_eliminar)
    this.subscription.add(this.postService.eliminarHerramienta(this.idHerramienta_eliminar).subscribe(res =>{
      if (res.Status === 'Se elimino la herramienta.'){
        this.toastService.show('Herramienta eliminada', { classname: 'bg-success text-light', delay: 2000 });
        setTimeout(() => {
          this.toastService.removeAll()
          this.modalService.dismissAll()
          this.disabledForm = false;
          this.ngOnInit()
        }, 1000);
      }
      console.log(res);
    }, err => {
      this.toastService.show( 'Problema al eliminar la herramienta '+ err.error.Error, { classname: 'bg-danger text-light', delay: 2000 });
      console.log(err)
      setTimeout(() => {
        this.toastService.removeAll()
        this.disabledForm = false;
      }, 3000);

    }));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

