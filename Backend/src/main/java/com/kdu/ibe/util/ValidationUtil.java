package com.kdu.ibe.util;

import com.kdu.ibe.dto.request.PaymentInfoRequestDTO;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;

import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class ValidationUtil {

    public static String getValidationErrors(BindingResult bindingResult) {
        return bindingResult.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
    }


    // verify credit card details are valid
    public static boolean validateCardDetails(int expiryMonth, int expiryYear) {
        if (!isValidExpiryDate(expiryMonth, expiryYear)) {
            throw new UnprocessableEntityException("Card has expired");
        }
        return true;
    }

    private static boolean isValidExpiryDate(int expiryMonth, int expiryYear) {
        if (expiryMonth < 1 || expiryMonth > 12 || expiryYear < 0) {
            return false;
        }
        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear() % 100;
        return (expiryYear > currentYear) || (expiryYear == currentYear && expiryMonth >= currentMonth);
    }


    public static boolean isValidEmail(String email) {
        // Regular expression for basic email validation
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.matches(emailRegex, email);
    }

}
