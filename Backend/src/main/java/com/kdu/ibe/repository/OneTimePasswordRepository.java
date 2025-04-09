package com.kdu.ibe.repository;

import com.kdu.ibe.entity.OneTimePassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface OneTimePasswordRepository extends JpaRepository<OneTimePassword, Long> {

    // Custom query method to find OTP by OTP value and booking ID
    OneTimePassword findByOtpValueAndBookingId(Long otpValue, Long bookingId);

    /**
     * Deletes OTP records by booking ID.
     *
     * @param bookingId the ID of the booking
     * @return the number of records deleted
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM OneTimePassword otp WHERE otp.bookingId = :bookingId")
    int deleteByBookingId(@Param("bookingId") Long bookingId);
}
