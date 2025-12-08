import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DBWord {
  id: number;
  en1: string;
  en2: string;
  en3: string;
  en4: string;
  vn1: string;
  speakSentenceCountMax: number;
  speakWordCountMax: number;
  page: number;
}

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'http://localhost:8080/words';

  constructor(private http: HttpClient) { }

  getWords(): Observable<DBWord[]> {
    return this.http.get<DBWord[]>(this.apiUrl);
  }

  markStudied(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/studied`, {});
  }
}
