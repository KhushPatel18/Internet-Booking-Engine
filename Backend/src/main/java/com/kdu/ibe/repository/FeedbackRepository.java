package com.kdu.ibe.repository;

import com.kdu.ibe.entity.Booking;
import com.kdu.ibe.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FeedbackRepository extends JpaRepository<Feedback,String> {
    List<Feedback> findAllByRoomTypeId(Long roomTypeId);
}
