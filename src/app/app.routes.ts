import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
  { path: 'who', loadComponent: () => import('./pages/who/who').then(m => m.Who) },
  { path: 'what-we-do', loadComponent: () => import('./pages/what-we-do/what-we-do').then(m => m.WhatWeDo) },
  { path: 'reports', loadComponent: () => import('./pages/reports/reports').then(m => m.Reports) },
  { path: 'initiative', loadComponent: () => import('./pages/initiative/initiative').then(m => m.Initiative) },
  { path: 'links', loadComponent: () => import('./pages/links/links').then(m => m.Links) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: '**', redirectTo: '' }
];
