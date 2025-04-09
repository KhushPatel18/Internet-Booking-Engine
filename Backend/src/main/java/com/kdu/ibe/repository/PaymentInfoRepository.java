package com.kdu.ibe.repository;


import com.kdu.ibe.entity.PaymentInfo;
import com.kdu.ibe.entity.TravellerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
    @Query("SELECT ti FROM PaymentInfo ti WHERE ti.booking.id = :bookingId")
    List<PaymentInfo> getByBookingId(Long bookingId);
}
