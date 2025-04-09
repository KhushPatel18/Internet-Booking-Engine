type FormValues = {
   firstName: string;
   lastName?: string | null;
   phone: string;
   email: string;
};
type FormValuesBilling = {
   billingFirstName: string;
   billingLastName?: string | null;
   billingAddress1: string;
   billingAddress2?: string;
   billingCountry: string;
   billingCity: string;
   billingState: string;
   billingZip: string;
   billingPhone: string;
   billingEmail: string;
};
type FormValuesPayment = {
   cardNumber: string;
   expiryMonth: string;
   expiryYear: string;
   cvvCode: string;
};
type CardName = {
   cardNumber: string;
};
type Booking = {
   travellerInfo: FormValues;
   billingInfo: FormValuesBilling;
   paymentInfo: CardName;
};
