package com.kdu.ibe.dto.response;

import com.kdu.ibe.dto.request.RoomRateDTO;

import java.util.Optional;

import lombok.*;

@Getter
@Setter
@Builder
public class RoomRateResponseDTO {
    private String date;
    private double price;
    @Builder.Default
    private Optional<Double> discountedPrice = Optional.empty();
}

