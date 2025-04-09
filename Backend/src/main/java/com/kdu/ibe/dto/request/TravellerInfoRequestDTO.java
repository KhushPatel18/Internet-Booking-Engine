package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class TravellerInfoRequestDTO {

    @NotBlank(message = "First name is required")
    private String firstName;
    private String lastName;
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 10, message = "Phone number must be 10 digits")
    @Pattern(regexp = "\\d+", message = "Phone number must contain only digits")
    private String phone;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
}
