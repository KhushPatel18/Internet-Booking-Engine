package com.kdu.ibe.repository;

import com.kdu.ibe.dto.request.BookingIdAndEmailDTO;
import com.kdu.ibe.entity.IternaryInfo;
import com.kdu.ibe.entity.PaymentInfo;
import com.kdu.ibe.entity.TravellerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IternaryInfoRepository extends JpaRepository<IternaryInfo, Long> {
    @Query("SELECT ti FROM IternaryInfo ti WHERE ti.booking.id = :bookingId")
    List<IternaryInfo> getByBookingId(Long bookingId);

    @Query(value = "SELECT DISTINCT b.booking_id AS bookingId, b.booking_email AS bookingEmail " +
            "FROM iternary_info i " +
            "JOIN booking b ON i.booking_id = b.booking_id " +
            "WHERE DATE(i.check_out_date) = CURRENT_DATE", nativeQuery = true)
    List<BookingIdAndEmailDTO> getBookingIdAndEmailsForCheckOutToday();


}
