package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BillingInfoRequestDTO {
    @NotBlank(message = "First name is required")
    private String billingFirstName;

    private String billingLastName;

    @NotBlank(message = "Address is required")
    private String billingAddress1;

    private String billingAddress2;

    @NotBlank(message = "Country is required")
    private String billingCountry;

    @NotBlank(message = "City is required")
    private String billingCity;

    @NotBlank(message = "State is required")
    private String billingState;

    @NotBlank(message = "ZIP code is required")
    private String billingZip;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Invalid phone number")
    private String billingPhone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String billingEmail;
}
