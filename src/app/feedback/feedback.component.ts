import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';
/**
 * Component for user feedback
 */
@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    ratingTopics = [
        'Layout',
        'Bedienbarkeit',
        'Kartenstyle',
        'Funktionen'
    ];

    constructor(private headerService: HeaderService) { }

    ngOnInit() {
        // Change header Title
        this.headerService.changeTitle('Bewertung');
    }

    /**
     * A rating star was selected
     * @param event Event
     */
    onSelectStar(event: any) {
        console.log(event.target.parentElement.parentElement);
    }
}
