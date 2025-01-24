import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { SurveyCreatorModule } from "survey-creator-angular";
import { SurveyCreatorComponent } from "./components/creator.component";

@NgModule({
    declarations: [AppComponent, SurveyCreatorComponent],
    imports: [BrowserModule, SurveyCreatorModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
