import { Component, OnInit } from '@angular/core';
import { OfferService } from '../Services/offer.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  

  percentageData: any[];

  

  data: any[];

  colorScheme: any;
  



  constructor( private offerService : OfferService) {}


  ngOnInit() {
    //this.getCompanyPercentage();

    this.loadPercentageData();

    this.setColorScheme();


    
    }

    /**************************************************** Chart ****************************************************************/
 /*
    getCompanyPercentage(){
    this.offerService.getCompanyPercentage().subscribe(
      data => {
        this.percentageData = data;
      },
      error => {
        console.error(error);
      }
    )
  }
*/


  loadPercentageData(): void {
    this.offerService.getCompanyPercentage().subscribe(
      data => {
        this.data = data.map(item => ({
          name: item.companySname,
          value: item.count 
        }));
      },
      error => {
        console.error(error);
      }
    );
  }

  formatYAxisTick(value: any): string {
    return value + "%";
  }
  


  setColorScheme(): void {
    const customColors = [
      '#C7DDFC', // First color
      '#C7DDFC', // Second color
      '#C7DDFC', // Third color
      '#C7DDFC'  // Fourth color
    ];

    this.colorScheme = {
      domain: customColors
    };
  }



  
}
