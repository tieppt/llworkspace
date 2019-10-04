import { Component, OnInit } from '@angular/core';
import {
  ContactsService,
  Contacts
} from '../../../core/services/contacts.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'll-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<Contacts[]>;
  constructor(
    private contactsService: ContactsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.contacts$ = this.contactsService.getContacts();
  }
}
