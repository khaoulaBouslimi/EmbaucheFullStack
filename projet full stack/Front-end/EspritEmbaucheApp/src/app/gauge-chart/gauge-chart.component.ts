import { AnimationBuilder, animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { EChartsOption } from 'echarts';
 

declare var GaugeChart: any;
import {   AnimationTriggerMetadata } from '@angular/animations';

export const countUpAnimation: AnimationTriggerMetadata = trigger('countUp', [
  transition(':increment', [
    style({ transform: 'scale(1.2)', opacity: 0 }),
    animate('500ms', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);
@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.css'] ,
  animations: [countUpAnimation]
})




export class GaugeChartComponent implements OnInit {
 

  single = [
    {
      name: 'Category A',
      value: 50,
    },
    {
      name: 'Category B',
      value: 70,
    },
    {
      name: 'Category C',
      value: 20,
    },
  ];
  colorScheme: any;

  setColorScheme(): void {
    const customColors = [
      '#C7DDFC', // First color
      '#5AA454', // Second color
      '#A10A28', // Third color 
    ];

    this.colorScheme = {
      domain: customColors
    };
  }
 
  
  currentJobOffersCount = 0;
  totalJobOffersCount: number; // The final count you'll get from the backend
  currentCandidatesCount = 0;
  totalCandidatesCount: number; // The final count you'll get from the backend

  constructor(private http: HttpClient, private animationBuilder: AnimationBuilder) { }

  ngOnInit() {
    this.fetchTotalJobOffersCount();
    this.fetchTotalCandidatesCount();
  }

  fetchTotalJobOffersCount() {
    this.http.get<number>('http://localhost:8000/joboffer/total-count').subscribe(count => {
      this.totalJobOffersCount = count;
      this.animateCounts();
    });
  }

  fetchTotalCandidatesCount() {
    this.http.get<number>('http://localhost:8000/candidatures/total-candidates-count').subscribe(count => {
      this.totalCandidatesCount = count;
      this.animateCounts();
    });
  }

  animateCounts() {
    if (this.totalJobOffersCount && this.totalCandidatesCount) {
      const interval = 100; // Duration of each animation step in milliseconds
      const steps = 100; // Total number of animation steps

      const jobOffersStep = Math.ceil(this.totalJobOffersCount / steps);
      const candidatesStep = Math.ceil(this.totalCandidatesCount / steps);

      const animate = () => {
        if (this.currentJobOffersCount < this.totalJobOffersCount) {
          this.currentJobOffersCount += jobOffersStep;
        }
        if (this.currentCandidatesCount < this.totalCandidatesCount) {
          this.currentCandidatesCount += candidatesStep;
        }

        if (
          this.currentJobOffersCount < this.totalJobOffersCount ||
          this.currentCandidatesCount < this.totalCandidatesCount
        ) {
          setTimeout(animate, interval);
        }
      };

      animate();
    }
  }


 
}
