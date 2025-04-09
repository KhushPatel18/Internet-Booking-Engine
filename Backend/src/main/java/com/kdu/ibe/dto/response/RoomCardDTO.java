package com.kdu.ibe.dto.response;

import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import lombok.*;

import java.util.List;
import java.util.Optional;

@Builder
@Data
public class RoomCardDTO {
    private String roomTypeName;
    private int maxCapacity;
    private int doubleBeds;
    private int singleBeds;
    private int area;
    private Long roomTypeId;
    private double averageRoomRate;
    private String[] carouselImages;
    private Double rating;
    private Integer review;
    private Optional<String> bestPromotion;
}
