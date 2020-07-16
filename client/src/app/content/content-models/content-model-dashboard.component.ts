import { Component, OnInit } from '@angular/core';
import {ContentModelService} from '../content-model.service';
import {Observable} from 'rxjs';
import {CustomSchema} from '../../custom-schemas/custom-schema.model';

@Component({
  selector: 'kz-content-model-dashboard',
  templateUrl: './content-model-dashboard.component.html',
  styleUrls: ['./content-model-dashboard.component.less']
})
export class ContentModelDashboardComponent implements OnInit {
    contentModels$: Observable<CustomSchema[]>;

  constructor(private contentModelService: ContentModelService) { }

  ngOnInit() {
      this.contentModels$ = this.contentModelService.getAll();
      this.contentModels$.subscribe(x => console.log(x));
  }

}
