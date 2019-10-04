import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { routes } from './constants/routes';
import { ContactsComponent } from './pages/contacts/contacts.component';

@NgModule({
  declarations: [ContactsComponent],
  imports: [CommonModule, NzTableModule, RouterModule.forChild(routes)]
})
export class ContactsModule {}
