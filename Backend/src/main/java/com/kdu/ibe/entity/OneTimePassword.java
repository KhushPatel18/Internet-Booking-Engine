package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "one_time_password")
public class OneTimePassword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_id")
    private Long otpId;

    @Column(name = "otp_value")
    private Long otpValue;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    @Column(name = "booking_id")
    private Long bookingId;

    // Expiration duration in minutes (default: 5 minutes)
    private static final int EXPIRATION_DURATION_MINUTES = 5;

    @PrePersist
    public void prePersist() {
        this.expiresAt = LocalDateTime.now().plusMinutes(EXPIRATION_DURATION_MINUTES);
    }
}
