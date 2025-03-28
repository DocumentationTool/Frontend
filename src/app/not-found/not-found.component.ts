import { Component } from '@angular/core';
import {Router} from '@angular/router';

/**
 * 404 error page when path not found
 */
@Component({
  selector: 'app-not-found',
  imports: [
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  /**
   * constructor
   * @param router
   */
  constructor(private router: Router) {
  }

  /**
   * navigation back to main page
   */
  onBack() {
    this.router.navigate(['main'])
  }
}
