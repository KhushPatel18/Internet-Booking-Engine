import React from "react";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { Header } from "../../src/Components/Header/Header";
import { store } from "../../src/redux/store";

describe("Header component", () => {
  it("renders without crashing in desktop view", () => {
    const messages = {
      en: {
        subtitle: "Internet Booking Engine",
        myBookings: "My Bookings",
        login: "LOGIN",
      },
    };

    cy.viewport(1024, 768); // Desktop view

    cy.mount(
      <Provider store={store}>
        <IntlProvider locale="en" messages={messages.en}>
          <Header />
        </IntlProvider>
      </Provider>
    );

    cy.contains("[data-testid=my-bookings]", "My Bookings").should("exist"); // Check if "My Bookings" button is present
    cy.contains("[data-testid=login]", "LOGIN").should("exist"); // Check if "LOGIN" button is present
  });

  it("renders without crashing in mobile view", () => {
    const messages = {
      en: {
        subtitle: "Internet Booking Engine",
        myBookings: "My Bookings",
        login: "LOGIN",
      },
      es: {
        subtitle: "Motor de Reserva de Internet",
        myBookings: "Mis Reservas",
        login: "acceso",
      },
    };

    cy.viewport(375, 667); // Mobile View

    cy.mount(
      <Provider store={store}>
        <IntlProvider locale="es" messages={messages.es}>
          <Header />
        </IntlProvider>
      </Provider>
    );

    cy.get("[data-testid=hamburger]").should("exist");
    cy.contains("[data-testid=my-bookings]", "Mis Reservas").should("exist");
    cy.contains("[data-testid=login]", "acceso").should("exist");
  });
});
