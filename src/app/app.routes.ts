import { Routes } from '@angular/router';
import { CustomMdCompSys } from './examples/custom-md-comp-sys/custom-md-comp-sys';
import { App } from './app';
import { ExtendingMark02 } from './examples/extending.mark.02/extending.mark.02';
import { Home } from './home/home';

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
    component: CustomMdCompSys
  },
  {
    path: "example2",
    title: "example2",
    component: ExtendingMark02
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'

  }


];
