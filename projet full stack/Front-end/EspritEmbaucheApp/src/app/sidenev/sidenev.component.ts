import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { StorageService } from '../Services/storage.service';


@Component({
  selector: 'app-sidenev',
  templateUrl: './sidenev.component.html',
  styleUrls: ['./sidenev.component.css']
})
export class SidenevComponent implements OnInit {


  selectedComponent: string  = 'default';

  @Input() companyId: number; // Receives the company ID from the parent component

  currentUser: any;
   
  constructor( private authService: AuthService, private storageService: StorageService, private router:Router) { 
    this.selectedComponent = 'offerslist';
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }

  /*
  resetComponent() {
    this.selectedComponent = 'default'; // Or set it to the initial value
  }

  resetContent() {
    this.router.navigate(['/sidenav']); // Navigate to the base URL
  }
  */

  loadComponent(component: string) {
    this.selectedComponent = component; 
    
  }

  


  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        // Redirect to the home page
        window.location.href = '/home';
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
