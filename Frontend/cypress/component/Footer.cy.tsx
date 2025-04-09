import React from "react";
import { IntlProvider } from "react-intl";
import { Footer } from "../../src/Components/Footer/Footer";

describe("Footer component", () => {
  it("renders without crashing", () => {
    const messages = {
      en: {
        allRightsReserved: "All Rights Reserved.",
      },
    };

    cy.mount(
      <IntlProvider locale="en" messages={messages.en}>
        <Footer />
      </IntlProvider>
    );

    cy.get("[data-testid=footer-copyright]").should(
      "contain",
      "© Kickdrum Technology Group LLC."
    );
    cy.get("[data-testid=footer-rights]").should(
      "contain",
      "All Rights Reserved."
    );
    cy.get("[data-testid=footer-icon]").should("exist");
  });
});

describe("Footer component testing in spanish", () => {
  it("renders without crashing", () => {
    const messages = {
      es: {
        allRightsReserved: "Tous droits réservés.",
      },
    };

    cy.mount(
      <IntlProvider locale="es" messages={messages.es}>
        <Footer />
      </IntlProvider>
    );

    cy.get("[data-testid=footer-copyright]").should(
      "contain",
      "© Kickdrum Technology Group LLC."
    );
    cy.get("[data-testid=footer-rights]").should(
      "contain",
      "Tous droits réservés."
    );
    cy.get("[data-testid=footer-icon]").should("exist");
  });
});
