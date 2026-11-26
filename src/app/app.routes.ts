import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Mission Control',
    loadComponent: () => import('./features/menu/main-menu').then((m) => m.MainMenu),
  },
  {
    path: 'mission',
    title: 'Mission Control – mission',
    loadComponent: () => import('./features/mission/mission-control').then((m) => m.MissionControl),
  },
  {
    path: 'runs/:id',
    title: 'Mission Control – debrief',
    loadComponent: () => import('./features/debrief/run-debrief').then((m) => m.RunDebrief),
  },
  {
    path: 'rules',
    title: 'Mission Control – rules',
    loadComponent: () => import('./features/rules/rules-page').then((m) => m.RulesPage),
  },
  { path: '**', redirectTo: '' },
];
