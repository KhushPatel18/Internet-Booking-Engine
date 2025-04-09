package com.kdu.ibe.repository;


import com.kdu.ibe.entity.BillingInfo;
import com.kdu.ibe.entity.IternaryInfo;
import com.kdu.ibe.entity.OneTimePassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingInfoRepository extends JpaRepository<BillingInfo, Long> {
    @Query("SELECT ti FROM BillingInfo ti WHERE ti.booking.id = :bookingId")
    List<BillingInfo> getByBookingId(Long bookingId);
}
