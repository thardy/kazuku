import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'kz-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
    routes: Route[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public el: ElementRef) { }

  ngOnInit(): void {
      // console.log(this.router.config);
      const config: Route[] = this.router.config;
      config.forEach((route: Route) => {
         if (route.data && route.data?.includeInSidebar === true && route.path) {
             this.routes.push(route);
         }
      });
      // console.log(this.routes);
  }

}
