package com.kdu.ibe.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "promotion_template")
public class PromotionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_template_id")
    private Long promotionTemplateId;

    @Column(columnDefinition = "TEXT")
    private String htmlTemplate;

}
