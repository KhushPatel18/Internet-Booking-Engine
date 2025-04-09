package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_type")
@Getter
@Setter
public class RoomDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    private Long roomTypeId;

    private String roomTypeName;

    @Column(columnDefinition = "TEXT[]")
    private String[] carouselImages;

    @Column(columnDefinition = "TEXT[]")
    private String[] amenities;

    private Double rating;

    private Integer review;

    @Column(columnDefinition = "TEXT")
    private String standardRateDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT[]")
    private String[] userDefinedPromotionsArray;
}
