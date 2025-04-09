package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
public class RatingUpdateRequestDTO {
    @NotNull
    @Min(value = 0, message = "rating cannot be negative")
    @Max(value = 5, message = "rating must be at most 5 in our hotels")
    private double rating;

    @NotNull
    @NotBlank
    private String feedbackId;

    @NotBlank(message = "Feedback content cant be empty")
    private String feedback;

    @NotNull
    @NotBlank(message = "room type name can't be empty")
    private String roomTypeName;
}
