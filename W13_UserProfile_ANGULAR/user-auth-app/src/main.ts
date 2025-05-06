import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
/*
ng new user-auth-app --standalone
cd user-auth-app
ng g component auth/register --standalone --flat --skip-tests
ng g component auth/login --standalone --flat --skip-tests
ng g component profile --standalone --flat --skip-tests
main.ts| app.component.ts| app.routes.ts| auth/register.component.ts| auth/login.component.ts| profile.component.ts
ng serve
*/