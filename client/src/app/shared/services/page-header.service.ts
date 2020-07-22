import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageHeaderService {

  constructor() { }

  getTestData(): Observable<any> {
      const testData = {
          pageTitle: 'Test'
      };
      return of(testData);
  }
}
