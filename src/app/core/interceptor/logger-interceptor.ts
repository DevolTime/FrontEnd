import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
    // Abre el grupo con un título descriptivo (ej: "GET http://localhost:3000/api/products")
    console.group(`[HTTP Request] ${req.method} ${req.url}`);

    // Impresiones dentro del grupo
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);

    // Cierra el grupo
    console.groupEnd();

    return next(req);
};