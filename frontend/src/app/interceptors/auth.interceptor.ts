import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from local storage
  const token = localStorage.getItem('authToken');

  // If we have a token, clone the request and add the Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pass the cloned request instead of the original request to the next handler
    return next(clonedRequest); 
  }

  // If no token, just pass the original request to the next handler
  return next(req);
};