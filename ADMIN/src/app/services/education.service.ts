import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataItem } from '../models/data-item.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private readonly apiUrl = 'http://localhost:5000/edu';

  constructor(private http: HttpClient) {}

  /**
   * Get all education data
   * @returns Observable with array of education data items
   */
  getEducationData(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.apiUrl);
  }

  /**
   * Get a specific education item by index
   * @param index - The index of the education item
   * @returns Observable with the education item
   */
  getEducationByIndex(index: string | number): Observable<DataItem> {
    return this.http.get<DataItem>(`${this.apiUrl}/${index}`);
  }
}

