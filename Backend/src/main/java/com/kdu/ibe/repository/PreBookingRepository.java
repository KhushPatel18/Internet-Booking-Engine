package com.kdu.ibe.repository;


import com.kdu.ibe.entity.PreBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Repository
public interface PreBookingRepository extends JpaRepository<PreBooking, Long> {


    boolean existsByPropertyIdAndRoomTypeIdAndRoomIdAndStartDateAndEndDate(
            Long propertyId, Long roomTypeId, Long roomId, Timestamp startDate, Timestamp endDate);

    @Modifying
    @Transactional
    @Query("DELETE FROM PreBooking WHERE propertyId = :propertyId AND roomTypeId = :roomTypeId AND roomId = :roomId AND startDate = :startDate AND endDate = :endDate")
    void deleteByUniqueConstraints(@Param("propertyId") Long propertyId,
                                   @Param("roomTypeId") Long roomTypeId,
                                   @Param("roomId") Long roomId,
                                   @Param("startDate") Timestamp startDate,
                                   @Param("endDate") Timestamp endDate);

}
