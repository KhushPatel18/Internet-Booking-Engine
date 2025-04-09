package com.kdu.ibe.dto.response;


import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoomModalResponseDTO {
    private String[] amenities;
    private String standardRateDescription;
    private String description;
    List<PromotionsResponseDTO.Promotion> promotions;
}
