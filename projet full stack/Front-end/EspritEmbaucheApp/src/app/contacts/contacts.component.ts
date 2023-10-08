import { Component,   OnInit, ViewChild } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../Services/contact.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HostListener } from '@angular/core';
 

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  animations: [
    trigger('fadeIn', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('1500ms ease-in-out')),
    ])
  ]
})

  
 


export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];

  animationState: string = 'hidden';
  animationStateFadeIn: string = 'hidden';

  constructor(private contactService: ContactService,private router: Router) {}


  ngOnInit(): void {
 
     this.getContacts();
  }
 
  @HostListener('window:scroll', ['$event'])
  checkIfInView() {
      
    //new effect 
    const sectionFadeIn = document.querySelector('#section-fade-in');

  if (sectionFadeIn) {
    const rect = sectionFadeIn.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      this.animationStateFadeIn = 'visible';
    } else {
      this.animationStateFadeIn = 'hidden';
    }
  }


  }
  

  getContacts(): void {
    this.contactService.getContacts().subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      },
      error => {
        console.error('Error fetching contacts:', error);
        // Handle error, show an error message, or do something else
      }
    );
  }


  deleteContact(contactId: number): void {
    Swal.fire({
        title: 'Êtes-vous sûr ?',
        icon: 'question',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprime-la !'
    }).then((result) => {
        if (result.isConfirmed) {
            this.contactService.deleteContact(contactId).subscribe(
                (response) => {
                    console.log(response); // "Contact deleted successfully!"
                    // Optionally, update the list of contacts after deletion
                    this.getContacts();
                },
                (error) => {
                    console.error('Error deleting the contact:', error);
                }
            );
        }
    });
  }


}
