package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class IternaryInfoRequestDTO {
    @NotBlank(message = "checkInDate is required")
    private String checkInDate;
    @NotBlank(message = "checkOutDate is required")
    private String checkOutDate;
    @NotNull
    @Min(value = 0, message = "Adults cannot be negative")
    private int adultCount;
    @Builder.Default
    @Min(value = 0, message = "childCount cannot be negative")
    private int childCount = 0;
    @Min(value = 0, message = "amountAtResort cannot be negative")
    private Long amountAtResort;
    @NotBlank(message = "checkInDate is required")
    private String guestName;
    @NotNull
    @Min(value = 0, message = "propertyId cannot be negative")
    private Long propertyId;
    @NotNull
    @NotEmpty
    private List<Long> availabilities;
    @NotBlank(message = "promoName is required")
    private String promoName;
    @NotBlank(message = "promoDescription is required")
    private String promoDescription;
    @NotBlank(message = "roomName is required")
    private String roomName;
    @NotBlank(message = "guestString is required")
    private String guestString;
    @Min(value = 0, message = "nightlyRate cannot be negative")
    private Long nightlyRate;
    @Min(value = 0, message = "subtotal cannot be negative")
    private Long subtotal;
    @Min(value = 0, message = "taxes cannot be negative")
    private Long taxes;
    @Min(value = 0, message = "vat cannot be negative")
    private Long vat;
    @Min(value = 1, message = "totalCost cannot be Zero or negative")
    private Long totalCost;
    private String roomImage;
}
