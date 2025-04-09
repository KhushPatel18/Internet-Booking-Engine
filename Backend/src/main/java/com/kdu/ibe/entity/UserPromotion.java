package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_promotions")
@Getter
@Setter
public class UserPromotion {

    @Id
    private String promotionTitle;

    private Long promotionId;

    private String promotionDescription;

    private boolean isDeactivated;

    private Integer minimumDaysOfStay;

    private Double priceFactor;

}
