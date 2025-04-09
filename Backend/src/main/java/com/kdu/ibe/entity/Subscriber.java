package com.kdu.ibe.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "subscribers")
@Data
public class Subscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscriber_id")
    private Long subscriberId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phone;
}