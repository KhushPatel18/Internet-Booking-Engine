package com.kdu.ibe.repository;

import com.kdu.ibe.entity.RoomDetails;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomDetailsRepository extends JpaRepository<RoomDetails, Long> {
    @Transactional
    @Modifying
    @Query("UPDATE RoomDetails rd SET rd.rating = :newRating, rd.review = :newReview WHERE rd.roomTypeName = :roomTypeName")
    void updateRatingAndReviewById(String roomTypeName, double newRating, int newReview);

    Optional<RoomDetails> findFirstByRoomTypeName(String roomTypeName);

}
