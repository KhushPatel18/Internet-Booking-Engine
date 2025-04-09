package com.kdu.ibe.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IternaryInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iternary_info_id")
    private Long iternaryInfoId;
    private String checkInDate;
    private String checkOutDate;
    private String packageName;
    private String packageDescription;
    private String roomName;
    private String guestString;
    private Long nightlyRate;
    private Long subtotal;
    private Long taxes;
    private Long vat;
    private Long total;
    private String roomImage;
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
