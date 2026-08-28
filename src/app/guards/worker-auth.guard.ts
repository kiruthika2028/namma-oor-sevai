import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';

export const workerAuthGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.isWorkerLoggedIn()) {
    return true;
  }

  // If someone tries to access the dashboard URL directly without being logged in,
  // redirect them to the Worker Login page
  return router.createUrlTree(['/worker-login']);
};
