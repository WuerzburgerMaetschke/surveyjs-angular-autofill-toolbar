import { Component, OnInit } from "@angular/core";
import { SurveyCreatorModel } from "survey-creator-core";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import { Serializer } from "survey-core";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";
import { addAutofillDataProperties, addAutofillToolbar } from "./autofill";

addAutofillDataProperties();

@Component({
  // tslint:disable-next-line:component-selector
  selector: "component-survey-creator",
  templateUrl: "./creator.component.html",
  styleUrls: ["./creator.component.css"],
})
export class SurveyCreatorComponent implements OnInit {
  model: SurveyCreatorModel;
  ngOnInit() {
    const options = {
      showLogicTab: true,
    };
    const creator = new SurveyCreatorModel(options);
    addAutofillToolbar(creator);
    creator.JSON = {
      logoPosition: "right",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "question1",
              autofillData: "value1",
            },
            {
              type: "text",
              name: "question2",
              autofillData: "value2",
            },
            {
              type: "text",
              name: "question3",
              autofillData: "123",
              inputType: "number",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "text",
              name: "question4",
              autofillData: "value4",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              type: "text",
              name: "question5",
              autofillData: "value5",
            },
            {
              type: "text",
              name: "question6",
              autofillData: "value6",
            },
          ],
        },
      ],
    };
    creator.showSidebar = true;
    this.model = creator;
  }
}
