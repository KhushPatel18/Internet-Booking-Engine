package com.kdu.ibe.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@Entity
public class Feedback {
    @Id
    @Column(name = "feedback_id", updatable = false, nullable = false)
    private String feedbackId;

    private String name;

    private boolean isSubmitted;

    @Column(columnDefinition = "TEXT")
    private String feedbackContent;

    private double rating;

    private Long roomTypeId;

    private int helpful;
    private int notHelpful;
    private Timestamp createdAt;

    // Constructor to generate UUID for feedbackId
    public Feedback() {
        this.feedbackId = UUID.randomUUID().toString();
        this.helpful = 0;
        this.notHelpful = 0;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }


}
