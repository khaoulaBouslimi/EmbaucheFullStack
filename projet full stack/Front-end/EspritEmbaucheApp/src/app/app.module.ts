import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OfferComponent } from './offer/offer.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SidenevComponent } from './sidenev/sidenev.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayOffersComponent } from './display-offers/display-offers.component';
import { OfferdetailsComponent } from './offerdetails/offerdetails.component';
import { EmailsComponent } from './emails/emails.component';
import { EmailService } from './Services/email.service';
import { OfferService } from './Services/offer.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JoboffersComponent } from './joboffers/joboffers.component';
import { ChartsComponent } from './charts/charts.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { PostulerComponent } from './postuler/postuler.component';
import { CompanyComponent } from './company/company.component';
import { CompanyListsComponent } from './company-lists/company-lists.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CandidatureComponent } from './candidature/candidature.component';
import { LoginComponent } from './login/login.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { RegisterComponent } from './register/register.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FooterComponent } from './footer/footer.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MatCardModule } from '@angular/material/card';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MailsComponent } from './mails/mails.component';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
   

@NgModule({
  declarations: [
    AppComponent,
    OfferComponent,
    HeaderComponent,
    SidenevComponent,
    DashboardComponent,
    DisplayOffersComponent,
    OfferdetailsComponent,
    EmailsComponent,
    JoboffersComponent,
    ChartsComponent,
    UploadFilesComponent,
    PostulerComponent,
    CompanyComponent,
    CompanyListsComponent,
    HomeComponent,
    CandidatureComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ContactsComponent,
    ForgotpasswordComponent,
    CompanydetailsComponent,
    MailsComponent,
    GaugeChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule, 
    ReactiveFormsModule,
    MatSnackBarModule,
    Ng2SearchPipeModule,
    RouterModule,
    NgxChartsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule, 
    AngularEditorModule,
    NgxChartsModule
    
  
    
    
    
  ],
  providers: [OfferService, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
