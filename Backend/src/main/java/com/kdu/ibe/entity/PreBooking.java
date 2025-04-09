package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "pre_booking")
public class PreBooking {

    @Id
    @Column(name = "pre_booking_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long preBookingId;

    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "room_type_id")
    private Long roomTypeId;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "start_date")
    private Timestamp startDate;

    @Column(name = "end_date")
    private Timestamp endDate;

    @Column(name = "email")
    private String email;
}
