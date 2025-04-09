package com.kdu.ibe.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OTPEmailRequestDTO {
    @NotNull
    @Email
    private String email;
    private String type;
    private String customerName;
    private String companyName;
    private Long bookingId;
}
