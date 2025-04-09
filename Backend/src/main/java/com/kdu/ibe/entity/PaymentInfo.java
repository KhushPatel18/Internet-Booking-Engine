package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_info_id")
    private Long paymentInfoId;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "expiry_month")
    private int expiryMonth;

    @Column(name = "expiry_year")
    private int expiryYear;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;


}
