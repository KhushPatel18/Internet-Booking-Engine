package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CancelRequestDTO {
    @NotNull
    @Min(value = 0,message = "bookingId cannot be negative")
    private Long bookingId;
    private Long otp;
    private String email;
    @NotNull
    @NotEmpty
    private List<Long> availabilities;
    @NotBlank(message = "checkInDate is required")
    private String checkInDate;
    @NotBlank(message = "checkOutDate is required")
    private String checkOutDate;
}
