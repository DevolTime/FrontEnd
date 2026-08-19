import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {


console.group(
  console.log(req.method),
  console.log(req.url),
  console.log(req.headers),
  console.groupEnd(),

)

  return next(req);
};
