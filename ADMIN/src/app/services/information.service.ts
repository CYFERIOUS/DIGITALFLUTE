import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataItem } from '../models/data-item.model';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private readonly apiUrl = 'http://localhost:5000/info';

  constructor(private http: HttpClient) {}

  /**
   * Get all information data
   * @returns Observable with array of information data items
   */
  getInformationData(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.apiUrl);
  }

  /**
   * Get a specific information item by index
   * @param index - The index of the information item
   * @returns Observable with the information item
   */
  getInformationByIndex(index: string | number): Observable<DataItem> {
    return this.http.get<DataItem>(`${this.apiUrl}/${index}`);
  }
}

