package com.kdu.ibe.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingUpdateResponseDTO {
    private double rating;
    private double reviews;
    private Long roomTypeName;
}
