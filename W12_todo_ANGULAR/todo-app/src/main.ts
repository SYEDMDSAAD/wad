import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
/*npm install -g @angular/cli
ng new todo-app
cd todo-app
ng generate component todo
ng serve
main.ts| app.routes.ts| app.component.ts| .html| todo.component.ts| .html| .css
*/