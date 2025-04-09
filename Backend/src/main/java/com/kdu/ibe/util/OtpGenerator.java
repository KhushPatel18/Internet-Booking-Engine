package com.kdu.ibe.util;

import java.security.SecureRandom;
import java.util.Random;

public class OtpGenerator {

    private static final String OTP_CHARACTERS = "0123456789";
    private static final int OTP_LENGTH = 6;

    public static String generateOTP() {
        Random random = new SecureRandom();
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(OTP_CHARACTERS.charAt(random.nextInt(OTP_CHARACTERS.length())));
        }
        return otp.toString();
    }
}