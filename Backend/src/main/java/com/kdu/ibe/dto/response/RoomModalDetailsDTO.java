package com.kdu.ibe.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RoomModalDetailsDTO {
    private String[] amenities;
    private String standardRateDescription;
    private String description;
}
