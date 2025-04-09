package com.kdu.ibe.repository;

import com.kdu.ibe.entity.UserPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserPromotionsRepository extends JpaRepository<UserPromotion, String> {

    @Query("SELECT up FROM UserPromotion up WHERE up.promotionTitle = :title AND up.minimumDaysOfStay <= :minDays AND up.isDeactivated = false")
    UserPromotion findPromotionByTitleAndMinDays(@Param("title") String title, @Param("minDays") int minDays);

}
