package com.kdu.ibe.util;

public class EmailTemplats {


    public static String bookingConformation(String customerName, String companyName, Long bookingId, String email) {
        String link = "https://ashy-field-043b8d00f.5.azurestaticapps.net/confirmation?bookingId=" + bookingId + "&email=" + email;
        return "<html>\n" +
                "<head>\n" +
                "    <title>Booking Confirmation</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: auto;\n" +
                "            background-color: #fff;\n" +
                "            padding: 30px;\n" +
                "            border-radius: 10px;\n" +
                "            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        p {\n" +
                "            color: #666;\n" +
                "        }\n" +
                "        .button {\n" +
                "            display: inline-block;\n" +
                "            background-color: #26266d;\n" +
                "            color: #fff;\n" +
                "            text-decoration: none;\n" +
                "            padding: 10px 20px;\n" +
                "            border-radius: 5px;\n" +
                "        }\n" +
                "        .button:hover {\n" +
                "            background-color: #0056b3;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <h1>Booking Confirmation</h1>\n" +
                "        <p>Dear " + customerName + ",</p>\n" +
                "        <p>We are pleased to confirm your booking. Your reservation has been successfully processed.</p>\n" +
                "        <p>Please let us know if you have any questions or need further assistance.</p>\n" +
                "        <p>Once you have experienced our service, we would greatly appreciate your feedback. Please click the button below to leave your feedback:</p>\n" +
                "        <a href=\"" + link + "\" class=\"button\">Check Booking Info.</a>\n" +
                "        <p>Thank you for choosing our service. We look forward to serving you!</p>\n" +
                "        <p>Best regards,<br>The " + companyName + " Team</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    public static String stayCompletion(String customerName, String companyName, String feedback,String roomName) {
        String link = "https://ashy-field-043b8d00f.5.azurestaticapps.net/feedback?feedbackId=" + feedback + "&roomName=" + roomName;
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Stay Completion</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: auto;\n" +
                "            background-color: #fff;\n" +
                "            padding: 30px;\n" +
                "            border-radius: 10px;\n" +
                "            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        p {\n" +
                "            color: #666;\n" +
                "        }\n" +
                "        .button {\n" +
                "            display: inline-block;\n" +
                "            background-color: #26266d;\n" +
                "            color: #fff;\n" +
                "            text-decoration: none;\n" +
                "            padding: 10px 20px;\n" +
                "            border-radius: 5px;\n" +
                "        }\n" +
                "        .button:hover {\n" +
                "            background-color: #0056b3;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <h1>Stay Completion</h1>\n" +
                "        <p>Dear " + customerName + ",</p>\n" +
                "        <p>We hope you had a pleasant stay with us. Your accommodation has been successfully completed.</p>\n" +
                "        <p>Your feedback is important to us in order to provide better service. Please share your experience by clicking the button below:</p>\n" +
                "        <a href=\"" + link + "\" class=\"button\">Leave Feedback</a>\n" +
                "        <p>Thank you for choosing to stay with us. We hope to see you again soon!</p>\n" +
                "        <p>Best regards,<br>The " + companyName + " Team</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>\n";
    }


    public static String otpMail(String customerName, String companyName, String otp, Long bookingId) {
        return "<html>\n" +
                "<head>\n" +
                "    <title>Cancel Booking OTP</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: auto;\n" +
                "            background-color: #fff;\n" +
                "            padding: 30px;\n" +
                "            border-radius: 10px;\n" +
                "            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        p {\n" +
                "            color: #666;\n" +
                "        }\n" +
                "        .otp{\n" +
                "            color: #333;\n" +
                "            font-weight: 700;\n" +
                "        }\n" +
                "        .button {\n" +
                "            display: inline-block;\n" +
                "            background-color: #26266d;\n" +
                "            color: #fff;\n" +
                "            text-decoration: none;\n" +
                "            padding: 10px 20px;\n" +
                "            border-radius: 5px;\n" +
                "        }\n" +
                "        .button:hover {\n" +
                "            background-color: #0056b3;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <h1>Cancel Booking OTP</h1>\n" +
                "        <p>Dear " + customerName + ",</p>\n" +
                "        <p>We received a request to cancel your booking with " + customerName + ".</p>\n" +
                "        <p>Booking ID: " + bookingId + "</p>\n" +
                "        <p class=\"otp\">OTP: " + otp + "</p>\n" +
                "        <p>If you didn't initiate this cancellation request, please contact us immediately.</p>\n" +
                "        <p>Thank you for choosing " + companyName + ".</p>\n" +
                "        <p>Best regards,<br>The  " + companyName + "    Team</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>\n";
    }
}
