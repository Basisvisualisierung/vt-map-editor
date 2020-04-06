import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';

/**
 * Component for information about legals, contact, privacy etc.
 */
@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InfoComponent implements OnInit, AfterViewInit {

    @ViewChild('content', { static: false }) content: ElementRef;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private http: HttpClient,
                private headerService: HeaderService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        const path = this.route.snapshot.url[0].path;
        let file = '';
        let header = '';
        if (path === 'privacy') {
            file = 'privacy.html';
            header = 'Datenschutz';
        } else if (path === 'legals') {
            file = 'legals.html';
            header = 'Impressum';
        }

        this.http.get('assets/templates/' + file, {responseType: 'text'}).subscribe((data) => {
            this.headerService.changeTitle(header);
            this.content.nativeElement.innerHTML = data;
        });

    }

    onCloseInfo() {
        this.router.navigate(['map']);
    }
}
