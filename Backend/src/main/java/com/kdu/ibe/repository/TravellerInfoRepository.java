package com.kdu.ibe.repository;

import com.kdu.ibe.entity.TravellerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TravellerInfoRepository extends JpaRepository<TravellerInfo, Long> {
    @Query("SELECT ti FROM TravellerInfo ti WHERE ti.booking.id = :bookingId")
    List<TravellerInfo> getByBookingId(Long bookingId);
}
