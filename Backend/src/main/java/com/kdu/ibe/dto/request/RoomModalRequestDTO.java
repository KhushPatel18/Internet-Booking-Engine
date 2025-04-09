package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class RoomModalRequestDTO {
    @Min(value = 1, message = "roomTypeId should be positive")
    private Long roomTypeId;
    @NotNull
    @NotBlank(message = "Start date cannot be empty required")
    @JsonProperty("start_date")
    private String startDate;
    @NotNull
    @NotBlank(message = "End date cannot be empty required")
    @JsonProperty("end_date")
    private String endDate;
}
