export interface Fruta {
  id: number;
  nombre: string;
  enTemporada: boolean;
  stockKg: number;
  creadoEn: string;
  imagen: string;
}


export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  creadoEn: string;
  totalIngresos: number;
  totalPagos: number;
  saldoPendiente: number;
}

export interface IngresoStock {
  id: number;
  fecha: string;
  cantidadKg: number;
  precioPorKg: number;
  notas?: string;
  frutaId: number;
  proveedorId: number;
  fruta: Fruta;
  proveedor: Proveedor;
}

export interface Venta {
  id: number;
  fecha: string;
  cantidadKg: number;
  precioPorKg: number;
  tipoVenta: string;
  notas?: string;
  frutaId: number;
  fruta: Fruta;
}

export interface PagoProveedor {
  id: number;
  fecha: string;
  monto: number;
  metodoPago: string;
  notas?: string;
  proveedorId: number;
  proveedor: Proveedor;
}

export interface Usuario {
  nombreUsuario: string;
  rol: string;
  token: string;
}

// DTOs — lo que se manda a la API
export interface FrutaDTO {
  nombre: string;
  enTemporada: boolean;
  stockKg: number;
}

export interface IngresoStockDTO {
  frutaId: number;
  proveedorId: number;
  cantidadKg: number;
  precioPorKg: number;
  notas?: string;
}

export interface VentaDTO {
  frutaId: number;
  cantidadKg: number;
  precioPorKg: number;
  tipoVenta: string;
  notas?: string;
}

export interface PagoProveedorDTO {
  proveedorId: number;
  monto: number;
  metodoPago: string;
  notas?: string;
}

export interface AuthDTO {
  nombreUsuario: string;
  password: string;
  rol?: string;
}