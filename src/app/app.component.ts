import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CalculateJourneyService } from './services/calculate-journey.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private journeys: Array<any>;
  public resultStringJourney: string;
  public resultStringDuration: string;
  public resultStringChanges: string;
  public stations: Array<any>;

  public departureStation: string;
  public arrivalStation: string;

  constructor(private db: AngularFireDatabase,
    public calculateJourneyService: CalculateJourneyService) {
    // Retrieve the journey data from Firebase
    db.list('/').valueChanges().subscribe(list => {
      this.journeys = list;
      calculateJourneyService.init(this.journeys);

      // Get a sorted list of unique stations
      let stations = [...new Set(this.journeys.map(journey => journey.DepartStation))].sort();

      this.stations = [...new Set(stations.map(journey => {
        return { value: journey, viewValue: journey }
      }))];
    });
  }

  public calculateRoute() {
    // if two valid stations are selected, calculate the results
    if (this.departureStation && this.arrivalStation) {
      const result = this.calculateJourneyService.processJourney(this.departureStation, this.arrivalStation);
      const changes = result.changes === 1 ? `There is 1 change.` : `There are ${result.changes} changes.`;
      const path = result.path.toString().split(',').join(' > ');

      this.resultStringJourney = `Journey: ${path}.`;
      this.resultStringDuration = `Duration: ${result.time} minutes.`;
      this.resultStringChanges = `${changes}`;
    } else {
      this.resultStringJourney = `Please select two stations.`;
      this.resultStringDuration = null;
      this.resultStringChanges = null;
    }
  }
}