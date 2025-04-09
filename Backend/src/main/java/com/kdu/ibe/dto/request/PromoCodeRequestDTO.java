package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import javax.validation.constraints.NotNull;

@Builder
@Data
@Getter
@Setter
public class PromoCodeRequestDTO {
    @NotNull(message = "Promo code cannot be null")
    @NotBlank(message = "Promo code cannot be empty")
    private String promoCode;
    @NotNull(message = "Room Type id cannot be null")
    @Min(value = 0, message = "Room Type id cannot be negative")
    private Long roomTypeId;
    @NotNull(message = "min days cannot be null")
    @Min(value = 0, message = "min days cannot be negative")
    @Max(value = 14, message = "min days cannot be more than 14")
    private Integer minDays;
}
