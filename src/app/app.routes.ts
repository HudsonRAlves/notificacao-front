import { Routes } from '@angular/router';
import { Home } from './screens/home/home';

export const routes: Routes = [
    { path: '', 
        component: Home 
    },
    {
        path: 'users',
        loadComponent: () => import('./screens/users/users').then(m => m.Users)
    },
    {
        path: 'notifications',
        loadComponent: () => import('./screens/notifications/notifications').then(m => m.Notifications)
    }
    
];
