
export interface ProductoStock {
    lote: string;
    unidad: number;
    codigoContenedor: number;
    nombreContenedor:string;
    detalleUbicacion: string;
    fechaVencimiento: any;
    id_productos?: number;
}
export interface Stock{
    id_grupoDeTrabajo: number;
    id_espacioFisico: number;
    id_producto : number;
    id_productoEnStock?: number;
    producto: ProductoStock;
    seguimiento:boolean;
}
export class StockEdicion{
    id_productoEnStock : number;
    producto: ProductoEdic;
    seguimiento: boolean;
}
export class ProductoEdic{
    codigoContenedor : number;
    detalleUbicacion: string;
    unidad: number;
    lote: string;
    id_productos: number;
    fechaVencimiento: any;
}
export class Consumir{
    unidad: number;
    id_productoEnStock:number;
    id_productos: number;

}