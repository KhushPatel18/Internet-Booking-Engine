import { BookingInfo } from "../Types/Confirmation";

export const validateParams = (bookingId: string, email: string) => {
   return isValidEmail(email) && !isNaN(parseInt(bookingId));
};

export function isValidEmail(email: string): boolean {
   // Regular expression for basic email validation
   const emailRegex: RegExp = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
   return emailRegex.test(email);
}

export function maskCardNumber(cardNumber: string) {
   // Convert the number to a string
   const cardNumberString: number = parseInt(cardNumber);

   // Check if the string represents a 16-digit number
   if (isNaN(cardNumberString)) {
      return "Invalid card number";
   }

   // Mask the card number
   const maskedNumber = `${"****-****-****-"}${cardNumber.slice(-4)}`;

   return maskedNumber;
}

export const initialBookingInfo: BookingInfo = {
   iternaryInfo: {
      iternaryInfoId: 1,
      checkInDate: "2024-05-01",
      checkOutDate: "2024-05-05",
      packageName: "Sample Package",
      packageDescription: "Sample Package Description",
      roomName: "Sample Room",
      guestString: "John Doe, Jane Doe",
      nightlyRate: 100,
      subtotal: 400,
      taxes: 40,
      vat: 20,
      total: 460,
      roomImage: "room-defualt.jpg",
      booking: {
         bookingId: 1,
         bookingEmail: "john@example.com",
         availabilities: [] as number[],
         canceled: false,
      },
   },
   paymentInfo: {
      paymentInfoId: 1,
      cardNumber: "1234567890123456",
      expiryMonth: 12,
      expiryYear: 2024,
      booking: {
         bookingId: 1,
         bookingEmail: "john@example.com",
         availabilities: [],
         canceled: false,
      },
   },
   billingInfo: {
      billingInfoId: 1,
      billingFirstName: "John",
      billingLastName: "Doe",
      billingAddress1: "123 Main St",
      billingAddress2: "Apt 101",
      billingCountry: "USA",
      billingCity: "New York",
      billingState: "NY",
      billingZip: "10001",
      billingPhone: "123-456-7890",
      billingEmail: "john@example.com",
      booking: {
         bookingId: 1,
         bookingEmail: "john@example.com",
         availabilities: [],
         canceled: false,
      },
   },
   travellerInfo: {
      travellerInfoId: 1,
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      email: "john@example.com",
      booking: {
         bookingId: 1,
         bookingEmail: "john@example.com",
         availabilities: [],
         canceled: false,
      },
   },
};

export function formatDate(dateString: string) {
   // Create a new Date object from the provided date string
   const date = new Date(dateString);

   // Options for formatting the date
   const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
   };

   // Format the date
   const formattedDate = date.toLocaleDateString("en-GB", options);

   return formattedDate;
}
