package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "billing_info_id")
    private Long billingInfoId;

    @Column(name = "billing_first_name")
    private String billingFirstName;

    @Column(name = "billing_last_name")
    private String billingLastName;

    @Column(name = "billing_address1")
    private String billingAddress1;

    @Column(name = "billing_address2")
    private String billingAddress2;

    @Column(name = "billing_country")
    private String billingCountry;

    @Column(name = "billing_city")
    private String billingCity;

    @Column(name = "billing_state")
    private String billingState;

    @Column(name = "billing_zip")
    private String billingZip;

    @Column(name = "billing_phone")
    private String billingPhone;

    @Column(name = "billing_email")
    private String billingEmail;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

}
