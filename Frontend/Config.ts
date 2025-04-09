export const msalConfig = {
   auth: {
      clientId: "92ee002b-a5a3-4ec2-9d00-80bc0027fbad",
      authority:
         "https://ibe24.b2clogin.com/ibe24.onmicrosoft.com/B2C_1_signin_signup_15",
      knownAuthorities: ["ibe24.b2clogin.com"],
      redirectUri: "https://ashy-field-043b8d00f.5.azurestaticapps.net/",
      postLogoutRedirectUri:
         "https://ashy-field-043b8d00f.5.azurestaticapps.net/",
      navigateToLoginRequestUrl: false,
   },
   cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
   },
};
