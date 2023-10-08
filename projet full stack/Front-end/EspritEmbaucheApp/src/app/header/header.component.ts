import { Component, OnInit } from '@angular/core';
import { OfferService } from '../Services/offer.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Chart } from 'chart.js';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  


  constructor( private offerService : OfferService) {}


  ngOnInit() {}


  
}
