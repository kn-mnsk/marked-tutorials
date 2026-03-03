import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Example01 } from './examples/example01/example01';

export const routes: Routes = [
  {
    path: 'home',
    title: "tutorial-home",
    component: Home,
    pathMatch: 'full'
  },
  {
    path: "example1",
    title: "example1",
    component: Example01
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'

  }


];
