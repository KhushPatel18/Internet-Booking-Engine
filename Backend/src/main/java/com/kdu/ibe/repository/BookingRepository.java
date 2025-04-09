package com.kdu.ibe.repository;


import com.kdu.ibe.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Booking b SET b.isCanceled = :isCanceled WHERE b.bookingId = :bookingId")
    int updateIsCanceledByBookingId(boolean isCanceled, Long bookingId);

    List<Booking> findAllByBookingEmail(String bookingEmail);

}