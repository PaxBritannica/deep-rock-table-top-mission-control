import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { requestPersistentStorage } from './core/storage/local-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    void requestPersistentStorage();
  }
}
