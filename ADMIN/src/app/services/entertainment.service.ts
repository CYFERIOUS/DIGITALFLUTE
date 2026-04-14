import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataItem } from '../models/data-item.model';

@Injectable({
  providedIn: 'root'
})
export class EntertainmentService {
  private readonly apiUrl = 'http://localhost:5000/fun';

  constructor(private http: HttpClient) {}

  /**
   * Get all entertainment data
   * @returns Observable with array of entertainment data items
   */
  getEntertainmentData(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.apiUrl);
  }

  /**
   * Get a specific entertainment item by index
   * @param index - The index of the entertainment item
   * @returns Observable with the entertainment item
   */
  getEntertainmentByIndex(index: string | number): Observable<DataItem> {
    return this.http.get<DataItem>(`${this.apiUrl}/${index}`);
  }
}

