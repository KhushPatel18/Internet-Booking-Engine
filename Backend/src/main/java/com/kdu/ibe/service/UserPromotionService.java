package com.kdu.ibe.service;

import com.kdu.ibe.entity.UserPromotion;
import com.kdu.ibe.repository.UserPromotionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserPromotionService {

    private final UserPromotionsRepository userPromotionsRepository;

    @Autowired
    public UserPromotionService(UserPromotionsRepository userPromotionsRepository) {
        this.userPromotionsRepository = userPromotionsRepository;
    }

    public Optional<UserPromotion> getPromotionByTitleAndMinDays(String promotionTitle, int minDays) {
        return Optional.ofNullable(userPromotionsRepository.findPromotionByTitleAndMinDays(promotionTitle, minDays));
    }
}
