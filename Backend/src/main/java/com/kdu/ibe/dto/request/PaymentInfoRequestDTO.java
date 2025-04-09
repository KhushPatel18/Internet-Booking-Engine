package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.CreditCardNumber;

@Data
@Getter
@Setter
public class PaymentInfoRequestDTO {

    @NotBlank(message = "Card type is required")
    @CreditCardNumber(ignoreNonDigitCharacters = true)
    private String cardNumber;

    @NotNull
    @Min(value = 1, message = "enter a valid expiry month")
    @Max(value = 12, message = "enter a valid expiry month")
    private int expiryMonth;

    @NotNull
    @Min(value = 2023, message = "enter a valid expiry year")
    private int expiryYear;
}
