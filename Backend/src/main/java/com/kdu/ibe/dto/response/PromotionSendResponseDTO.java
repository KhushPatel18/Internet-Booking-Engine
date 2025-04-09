package com.kdu.ibe.dto.response;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionSendResponseDTO {
    private boolean isDeactivated;
    private int minimumDaysOfStay;
    private Double priceFactor;
    private String promotionDescription;
    private int promotionId;
    private String promotionTitle;
}
