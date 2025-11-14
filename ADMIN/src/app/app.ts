import { Component, signal, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InformationService } from './services/information.service';
import { EducationService } from './services/education.service';
import { EntertainmentService } from './services/entertainment.service';
import { DataItem } from './models/data-item.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ADMIN');
  
  // Information data
  informationData: DataItem[] = [];
  isLoadingInformation = false;
  informationError: string | null = null;
  
  // Education data
  educationData: DataItem[] = [];
  isLoadingEducation = false;
  educationError: string | null = null;
  
  // Entertainment data
  entertainmentData: DataItem[] = [];
  isLoadingEntertainment = false;
  entertainmentError: string | null = null;

  constructor(
    private informationService: InformationService,
    private educationService: EducationService,
    private entertainmentService: EntertainmentService,
    private cdr: ChangeDetectorRef
  ) {
    // Load data after the component is fully rendered
    afterNextRender(() => {
      this.loadInformationData();
      this.loadEducationData();
      this.loadEntertainmentData();
    });
  }

  ngOnInit(): void {
    // Data loading moved to afterNextRender to avoid change detection errors
  }

  loadInformationData(): void {
    this.isLoadingInformation = true;
    this.informationError = null;
    
    this.informationService.getInformationData().subscribe({
      next: (data) => {
        this.informationData = data;
        this.isLoadingInformation = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading information data:', error);
        this.informationError = 'Failed to load information data. Please try again later.';
        this.isLoadingInformation = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadEducationData(): void {
    this.isLoadingEducation = true;
    this.educationError = null;
    
    this.educationService.getEducationData().subscribe({
      next: (data) => {
        this.educationData = data;
        this.isLoadingEducation = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading education data:', error);
        this.educationError = 'Failed to load education data. Please try again later.';
        this.isLoadingEducation = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadEntertainmentData(): void {
    this.isLoadingEntertainment = true;
    this.entertainmentError = null;
    
    this.entertainmentService.getEntertainmentData().subscribe({
      next: (data) => {
        this.entertainmentData = data;
        this.isLoadingEntertainment = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading entertainment data:', error);
        this.entertainmentError = 'Failed to load entertainment data. Please try again later.';
        this.isLoadingEntertainment = false;
        this.cdr.markForCheck();
      }
    });
  }

  onEdit(item: DataItem): void {
    console.log('Edit button clicked for item:', item);
    // Add your edit logic here
  }

  onDelete(item: DataItem): void {
    console.log('Delete button clicked for item:', item);
    // Add your delete logic here
  }
}
