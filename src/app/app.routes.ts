import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MarketDataComponent } from './pages/market-data/market-data.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'market-data/:id', component: MarketDataComponent },
];
