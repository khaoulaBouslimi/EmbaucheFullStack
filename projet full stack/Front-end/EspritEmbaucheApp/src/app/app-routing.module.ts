import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferComponent } from './offer/offer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisplayOffersComponent } from './display-offers/display-offers.component';
import { OfferdetailsComponent } from './offerdetails/offerdetails.component';
import { EmailsComponent } from './emails/emails.component';
import { JoboffersComponent } from './joboffers/joboffers.component';
import { SidenevComponent } from './sidenev/sidenev.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { PostulerComponent } from './postuler/postuler.component';
import { CompanyComponent } from './company/company.component';
import { CompanyListsComponent } from './company-lists/company-lists.component';
import { HomeComponent } from './home/home.component';
import { CandidatureComponent } from './candidature/candidature.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { MailsComponent } from './mails/mails.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';


const routes: Routes = [



  { path:"emails", component:MailsComponent, outlet: 'sideNavOutlet' },
 
  { path: 'addOffer', component: OfferComponent, outlet: 'sideNavOutlet' },  

  { path:"companyList", component:CompanyListsComponent , outlet: 'sideNavOutlet'},

  { path:"company", component:CompanyComponent , outlet: 'sideNavOutlet'},

  { path:"candidaturesList", component:CandidatureComponent , outlet: 'sideNavOutlet' },

  { path:"registeradmin", component:RegisterComponent , outlet: 'sideNavOutlet'},



  { path: 'sidenav', component: SidenevComponent, children: [
    { path: '', redirectTo: 'adminDashboard', pathMatch: 'full' },
    { path: 'addOfferForm/:id', component: OfferComponent },
    { path: 'candidaturesList/:idJobOffer', component: CandidatureComponent },


    // Add more routes for other components you want to display within the sidenav   
    //{ path:"companyList", component:CompanyListsComponent },    
    //{ path: 'addOfferForm', component: OfferComponent },

  ]},

  


  
  
  { path:"Login", component:LoginComponent },
  { path:"register", component:RegisterComponent },
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },

  { path:"adminDashboard", component:SidenevComponent},

  { path:"home", component:HomeComponent },

  { path:"jobOffers", component:JoboffersComponent },

  //{ path:"candidaturesList", component:CandidatureComponent },

  { path: 'addoffercomponent', component: OfferComponent},  

  { path:"email", component:EmailsComponent  },

  { path:"postuler/:idOffre", component:PostulerComponent},

  { path:"resetpassword", component:ForgotpasswordComponent  },

  { path: 'jobofferdetail/:idJobOffer', component: OfferdetailsComponent },

  { path: 'companydetail/:idcompany', component: CompanydetailsComponent },



  { path:"f", component:PostulerComponent},
  { path:"j", component:OfferdetailsComponent},



  
  { path:"5alabiza", component:DashboardComponent},



  //bch nfasa5ha
  { path: 'o', component: DisplayOffersComponent},  

  { path: 'PostulerComponent', component: PostulerComponent},

  //mezelet bch narja3elha
  { path:"detail/:idOffer", component:OfferdetailsComponent},
  { path:"details", component:OfferdetailsComponent},
  { path:"postulerr", component:PostulerComponent},
  { path:"gauge", component:GaugeChartComponent},


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
