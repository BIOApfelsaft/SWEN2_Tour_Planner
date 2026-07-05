import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (err.error instanceof ErrorEvent) {
        // 1. Client-side or network error
        errorMessage = err.error.message;
      } else {
        // 2. Backend error routing
        if (err.status === 400 && err.error && err.error.errors) {
          // Extract ASP.NET Core Data Annotation Validation errors
          const validationErrors = err.error.errors;
          const messages: string[] = [];

          for (const field in validationErrors) {
            if (Object.prototype.hasOwnProperty.call(validationErrors, field)) {
              messages.push(...validationErrors[field]);
            }
          }
          errorMessage = messages.join('\n');
        } else if (err.error && err.error.message) {
          // Extract custom backend exception/conflict messages
          errorMessage = err.error.message;
        } else if (err.status !== 0) {
          // Fallback for standard HTTP errors if no custom message exists
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
      }

      // We throw a standard JavaScript Error object containing the clean string
      return throwError(() => new Error(errorMessage));
    })
  );
};