import {
  Action,
  ComputedUpdater,
  Question,
  Serializer,
  SurveyModel,
} from "survey-core";
import { SurveyCreatorModel } from "survey-creator-core";

export function addAutofillDataProperties() {
  Serializer.addProperty("question", {
    type: "boolean",
    name: "autofillDataIsJson",
    category: "Autofill",
    onSetValue: (survey, value) => {
      survey.setPropertyValue("autofillDataIsJson", value);
    },
    displayName: "Daten als JSON",
    default: false,
  });

  Serializer.addProperty("question", {
    type: "text",
    name: "autofillData",
    category: "Autofill",
    onSetValue: (survey, value) => {
      survey.setPropertyValue("autofillData", value);
    },
    displayName: "Daten",
    default: null,
  });
}

export function addAutofillToolbar(creator: SurveyCreatorModel) {
  let currentTestSurvey: SurveyModel | undefined;

  creator.onTestSurveyCreated.add((_, options) => {
    currentTestSurvey = options.survey;
  });

  const autofillQuestionAction = new Action({
    id: "svd-autofill-question",
    tooltip: "Nächste Frage automatisch ausfüllen",
    iconName: "icon-theme",

    visible: new ComputedUpdater(() => creator.activeTab === "test"),
    enabled: true,

    action: () => {
      const s = currentTestSurvey;
      if (s) {
        //iterate over all pages, question by question fill autofill data for all questions without a value
        for (let pageIndex = 0; pageIndex < s.pages.length; pageIndex++) {
          const p = s.pages[pageIndex];
          for (let i = 0; i < p.questions.length; i++) {
            const q = p.questions[i];
            if (!s.getValue(q.name)) {
              autofillQuestion(q, s);
              //if this is the last question on current page and there is a next page, go to next page:
              if (
                i === p.questions.length - 1 &&
                pageIndex < s.pages.length - 1
              ) {
                s.nextPage();
              }
              return;
            }
          }
        }
      }
    },
  });

  const autofillPageAction = new Action({
    id: "svd-autofill-page",
    tooltip:
      "Aktuelle Seite automatisch ausfüllen und zur nächsten Seite springen",
    iconName: "icon-theme",

    visible: new ComputedUpdater(() => creator.activeTab === "test"),
    enabled: true,

    action: () => {
      const s = currentTestSurvey;
      if (s) {
        //iterate over all pages, question by question fill autofill data for all questions without a value
        const p = s.pages[s.currentPageNo];
        for (let i = 0; i < p.questions.length; i++) {
          autofillQuestion(p.questions[i], s);
          //if this is the last question on current page and there is a next page, go to next page:
        }
        s.nextPage();
      }
    },
  });

  const autofillSurveyAction = new Action({
    id: "svd-autofill-survey",
    tooltip: "Alle Fragen automatisch ausfüllen",
    iconName: "icon-theme",

    visible: new ComputedUpdater(() => creator.activeTab === "test"),
    enabled: true,

    action: () => {
      const s = currentTestSurvey;
      if (s) {
        console.log(s.data);
        //iterate over all questions and autofill them
        s.getAllQuestions().forEach((q) => {
          autofillQuestion(q, s);
        });
      }
    },
  });

  creator.toolbar.actions.splice(0, 0, autofillSurveyAction);
  creator.toolbar.actions.splice(0, 0, autofillPageAction);
  creator.toolbar.actions.splice(0, 0, autofillQuestionAction);
}

function autofillQuestion(question: Question, surveyModel: SurveyModel) {
  const q = question as Question & {
    autofillData: string;
    autofillDataIsJson: boolean;
  };
  if (q.autofillData) {
    if (q.autofillDataIsJson) {
      try {
        surveyModel.setValue(q.name, JSON.parse(q.autofillData));
      } catch (err) {
        alert(
          "Fehler beim Autofill der Frage: " +
            q.name +
            "\n Der Autofill-Wert: \n\n" +
            q.autofillData +
            "\n\nkann nicht als Json-Objekt erstellt werden!\n" +
            err
        );
      }
    } else {
      surveyModel.setValue(q.name, q.autofillData);
    }
  }
}
