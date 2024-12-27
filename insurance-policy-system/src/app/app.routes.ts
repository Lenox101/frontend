import { Routes } from '@angular/router';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { PolicyFormComponent } from './components/policy-form/policy-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'policies', pathMatch: 'full' },
  { path: 'policies', component: PolicyListComponent },
  { path: 'policies/new', component: PolicyFormComponent },
  { path: 'policies/edit/:id', component: PolicyFormComponent }
];
