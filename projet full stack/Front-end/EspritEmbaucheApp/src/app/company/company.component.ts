import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OfferService } from '../Services/offer.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../Services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../company';
import { SidenevComponent } from '../sidenev/sidenev.component';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {




  scategorie : any={};
  wcode : string = '';
  userFile : any;
  public imagePath: any;
  imgURL: any;
  public message: string;
  toastr: any;

  dataForm: FormGroup;


  constructor(public companyService: CompanyService ,
                public fb: FormBuilder,
                private router : Router,
                private sidenavComponent: SidenevComponent,
                private formBuilder: FormBuilder) 
                {
                  
               }



  ngOnInit() {
    this.infoForm();
   }
  
   infoForm() {
    this.companyService.dataForm = this.fb.group({
        id: null,
        companySname: ['', [Validators.required]],
        nbrEmployees: ['', [Validators.required]],
        adress: ['', [Validators.required]],
        numTel: ['', [Validators.required]]
      });
    }
  

    addData() {
      const form = this.companyService.dataForm;
      if (form.invalid) {
        // Highlight the unfilled fields and display an error message
        this.markFormGroupTouched(form);
        console.log('Please fill in all required fields.');
        return;
      }
      const formData = new FormData();
      const company = this.companyService.dataForm.value;
      formData.append('company', JSON.stringify(company));
      formData.append('file', this.userFile);
    
      this.companyService.createData(formData).subscribe((companyId: number) => {
        this.router.navigate(['/sidenav/addOfferForm', companyId]);
      });
    }

    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity(); // Add this line
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
    
    redirectToDashboard() {
      this.router.navigate(['/sidenav/addOfferForm']);
    }

    
  onSelectFile(event: any) {
    if (event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.userFile = file;
      //this.f['profile'].setValue(file);
 
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.success( 'Only images are supported.');
      
      return;
    }
 
    var reader = new FileReader();
    
    this.imagePath = file;
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }
     
      
    }


    ResetForm() {
      this.companyService.dataForm.reset();
  }




  selectedImage: string | undefined;

onSelectFileround(event: any) {
  if (event.target && event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    this.userFile = file;

    const mimeType = file.type;
    if (!mimeType.match(/image\/*/)) {
      this.toastr.success('Only images are supported.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgURL = reader.result as string;
    };
  }
}


navigateToOffer(): void {
  this.sidenavComponent.selectedComponent = 'offers'; // Set the selectedComponent property
  this.router.navigate(['/offers']);
}



}

