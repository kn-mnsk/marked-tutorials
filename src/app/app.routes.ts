import { Routes } from '@angular/router';
import { CustomMdCompSys } from './examples/custom-md-comp-sys/custom-md-comp-sys';
import { App } from './app';

export const routes: Routes = [
  {
    path: "home",
    title: "tutorial-home",
    component: App
  },
  {
    path: "home/example1",
    title: "example1",
    component: CustomMdCompSys
  },
    {
    path: '',
    redirectTo: "home",
    pathMatch: 'full'
  },

];
