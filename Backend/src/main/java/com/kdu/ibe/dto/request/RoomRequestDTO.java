package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDTO {
    @NotNull
    @NotBlank(message = "Start date cannot be empty required")
    @JsonProperty("start_date")
    private String startDate;

    @NotNull
    @NotBlank(message = "End date cannot be empty required")
    @JsonProperty("end_date")
    private String endDate;

    @NotNull
    @Min(value = 0, message = "propertyId cannot be negative")
    @JsonProperty("property_id")
    private Integer propertyId;

    @NotNull
    @Builder.Default
    @Min(value = 0, message = "Adults cannot be negative")
    private Integer adults = 0;

    @Builder.Default
    @Min(value = 0, message = "Teens cannot be negative")
    private Integer teens = 0;

    @Builder.Default
    @Min(value = 0, message = "Kids cannot be negative")
    private Integer kids = 0;

    @Builder.Default
    @JsonProperty("senior_citizen")
    @Min(value = 0, message = "seniorCitizen cannot be negative")
    private Integer seniorCitizen = 0;

    @Builder.Default
    @Min(value = 0, message = "rooms cannot be Zero or negative")
    private Integer rooms = 1;

    @Builder.Default
    @Min(value = 0, message = "beds cannot be Zero or negative")
    @Max(value = 3, message = "Beds must be at most 3 in our hotels")
    private Integer beds = 1;


    // possible sort filters
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("sort_rate")
    private String sortRate;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("sort_rating")
    private String sortRating;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("sort_review")
    private String sortReview;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("sort_name")
    private String sortName;


    // possible narrow filters
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("room_types")
    private List<String> roomTypes;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("bed_types")
    private List<String> bedTypes;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("price_range")
    private PriceRange priceRange;
}


















