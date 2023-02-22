import {Component, Input, OnInit} from '@angular/core';
import {ScheduleService} from './schedule.service';
import {NgForm} from '@angular/forms';
import {BaseComponent} from '@common/base-component';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'kz-schedule',
    templateUrl: './schedule.component.html'
})
export class SchedulesComponent extends BaseComponent implements OnInit {
    @Input() siteId: string;
    regenerationInterval: number;
    editing = false;
    saving = false;

    constructor(private scheduleService: ScheduleService) {
        super();
    }

    ngOnInit() {
        this.scheduleService.getSiteScheduleJob(this.siteId)
            .pipe(

            )
            .subscribe((agendaJob) => {
                if (agendaJob) {
                    const repeatInterval = agendaJob.repeatInterval;
                    // grab the first number out of the repeatInterval
                    const matchArray = repeatInterval.match(/\d+/);
                    this.regenerationInterval = matchArray[0];
                }
            });
    }

    save(form: NgForm) {
        const minutes = form.value.regenerationInterval;
        this.scheduleService.save(this.siteId, minutes)
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(
                (result) => {
                    this.regenerationInterval = minutes;
                    this.saving = false;
                    this.editing = false;
                },
                (error) => {
                    this.saving = false;
                    this.editing = false;
                }
            );
    }

    cancel() {
        this.editing = false;
    }

    editSchedule() {
        this.editing = true;
    }
}
