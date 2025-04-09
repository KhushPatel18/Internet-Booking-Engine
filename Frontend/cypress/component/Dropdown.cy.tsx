import React from "react";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { Header } from "../../src/Components/Header/Header";
import { store } from "../../src/redux/store";

const messages = {
  en: {
    subtitle: "Internet Booking Engine",
    myBookings: "My Bookings",
    login: "LOGIN",
  },
};

describe("Header component", () => {
  it("renders without crashing in mobile view", () => {
    // Mobile View
    cy.viewport(600, 768);

    cy.mount(
      <Provider store={store}>
        <IntlProvider locale="en" messages={messages.en}>
          <Header />
        </IntlProvider>
      </Provider>
    );

    cy.get("[data-testid=hamburger]").should("exist");
    cy.get("[data-testid=dropdown-button]").should("exist");
  });

  it("renders without crashing in desktop view", () => {
    // Desktop view
    cy.viewport(1024, 768);

    cy.mount(
      <Provider store={store}>
        <IntlProvider locale="en" messages={messages.en}>
          <Header />
        </IntlProvider>
      </Provider>
    );
    cy.get("[data-testid=dropdown-button]").should("exist");
  });
});
