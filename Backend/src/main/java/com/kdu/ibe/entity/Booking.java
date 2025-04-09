package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {

    @Id
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "booking_email")
    private String bookingEmail;

    @Column(columnDefinition = "BIGINT[]")
    private Long[] availabilities;

    private boolean isCanceled;

}
