package com.kdu.ibe.dto.ConfigurationsDTOs;




import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.index.qual.NonNegative;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyConfigurationDTO {
    @NotEmpty
    private String name;

    @NotEmpty
    @Size(min = 1)
    private List<String> landingPageFilters;

    @Valid
    @Size(min = 1)
    private List<NarrowRoomFilterDTO> narrowRoomResultPageFilters;

    @Valid
    @Size(min = 1)
    private List<SortingFilterDTO> sortingFilters;

    @NotEmpty
    @Size(min = 1)
    private List<String> languages;

    @NotEmpty
    @Size(min = 1)
    private List<String> currencies;

    @Valid
    @Size(min = 1)
    private List<AllowedGuestDTO> allowedGuests;

    @Positive
    private int maxRoomAllowed;

    @Positive
    private int maxBedAllowed;

    @NonNegative
    private double vat;

    @NonNegative
    private double resortFee;

    @NonNegative
    private double occupancyTax;

    @Positive
    private double dueNow;

    @Positive
    private int maxGuestAllowedAtTime;

    @NotEmpty
    private String bannerImage;
}