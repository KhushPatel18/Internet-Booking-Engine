package com.kdu.ibe.service;

import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import com.kdu.ibe.dto.request.PromoCodeRequestDTO;
import com.kdu.ibe.dto.response.PromotionSendResponseDTO;
import com.kdu.ibe.entity.RoomDetails;
import com.kdu.ibe.entity.UserPromotion;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.repository.RoomDetailsRepository;
import com.kdu.ibe.repository.UserPromotionsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing promotions.
 * This class provides methods to fetch promotions, filter them based on various criteria, and apply promotions based on promo codes.
 */
@Service
@Slf4j
public class PromotionService {

    private final UserPromotionsRepository userPromotionsRepository;

    private final RoomDetailsRepository roomDetailsRepository;

    private final ThirdPartyAPIService thirdPartyAPIService;

    private final Integer myKey = 69;

    @Autowired
    public PromotionService(UserPromotionsRepository userPromotionsRepository, RoomDetailsRepository roomDetailsRepository, ThirdPartyAPIService thirdPartyAPIService) {
        this.userPromotionsRepository = userPromotionsRepository;
        this.roomDetailsRepository = roomDetailsRepository;
        this.thirdPartyAPIService = thirdPartyAPIService;
    }


    /**
     * Fetches all promotions from a third-party API and caches the result.
     *
     * @param myKey a key used for caching
     * @return a list of promotions
     */
    @Cacheable(value = "promotions", key = "#mykey", cacheManager = "caffeineCacheManager")
    public List<PromotionsResponseDTO.Promotion> getAllPromotions(int myKey) {
        String graphqlQuery = "query MyQuery { "
                + "  listPromotions(where: {}) { "
                + "    is_deactivated "
                + "    minimum_days_of_stay "
                + "    price_factor "
                + "    promotion_description "
                + "    promotion_id "
                + "    promotion_title "
                + "  } "
                + "}";

        PromotionsResponseDTO responseDTO = thirdPartyAPIService.getPayload(PromotionsResponseDTO.class, graphqlQuery);

        return responseDTO.getData().getListPromotions();
    }

    /**
     * Filters promotions based on a minimum number of days.
     *
     * @param minimumNumberOfDays the minimum number of days for which the promotions are applicable
     * @return a list of filtered promotions
     */
    public List<PromotionsResponseDTO.Promotion> getFilteredPromotions(int minimumNumberOfDays) {
        return getAllPromotions(myKey).stream().filter(promotion -> !promotion.isDeactivated() && promotion.getMinimumDaysOfStay() <= minimumNumberOfDays).toList();
    }

    /**
     * Retrieves the minimum promotion based on various criteria.
     *
     * @param minimumNumberOfDays the minimum number of days for which the promotions are applicable
     * @param isLongWeekend       flag indicating if it's a long weekend
     * @param isWeekend           flag indicating if it's a weekend
     * @param isSeniorCitizen     flag indicating if the user is a senior citizen
     * @return an Optional of the minimum promotion
     */
    public Optional<PromotionsResponseDTO.Promotion> retrieveMinimumPromotions(int minimumNumberOfDays, boolean isLongWeekend, boolean isWeekend, boolean isSeniorCitizen) {
        log.info(isLongWeekend + "");
        List<PromotionsResponseDTO.Promotion> filteredPromotions = getFilteredPromotions(minimumNumberOfDays).stream()
                .filter(promotion ->
                        (isWeekend && promotion.getPromotionTitle().equals("Weekend discount")) ||
                                (isLongWeekend && promotion.getPromotionTitle().equals("Long weekend discount")) ||
                                (!promotion.getPromotionTitle().equals("Long weekend discount") &&
                                        !promotion.getPromotionTitle().equals("Weekend discount") &&
                                        !promotion.getPromotionTitle().equals("SENIOR_CITIZEN_DISCOUNT"))
                )
                .toList();
        return filteredPromotions.stream()
                .min(Comparator.comparingDouble(PromotionsResponseDTO.Promotion::getPriceFactor));
    }

    /**
     * Checks if a date range is considered a long weekend.
     *
     * @param startDate the start date of the range
     * @param endDate   the end date of the range
     * @return true if the date range is a long weekend, false otherwise
     */
    public static boolean isLongWeekend(Date startDate, Date endDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        while (!calendar.getTime().after(endDate)) {
            int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            if (dayOfWeek == Calendar.SATURDAY) {
                Calendar nextDay = (Calendar) calendar.clone();
                nextDay.add(Calendar.DATE, 1);
                if (nextDay.getTime().after(endDate)) {
                    return false;
                } else {
                    int nextDayOfWeek = nextDay.get(Calendar.DAY_OF_WEEK);
                    if (nextDayOfWeek == Calendar.SUNDAY) {
                        return true;
                    }
                }
            }
            calendar.add(Calendar.DATE, 1);
        }
        return false;
    }

    /**
     * Checks if a date range is considered a weekend.
     *
     * @param startDate the start date of the range
     * @param endDate   the end date of the range
     * @return true if the date range is a weekend, false otherwise
     */
    private boolean isWeekend(Date startDate, Date endDate) {
        LocalDate startLocalDate = Instant.ofEpochMilli(startDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endLocalDate = Instant.ofEpochMilli(endDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
        return startLocalDate.getDayOfWeek() == DayOfWeek.SATURDAY && endLocalDate.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    /**
     * Retrieves valid promotions based on start and end dates.
     *
     * @param startDateString the start date in string format
     * @param endDateString   the end date in string format
     * @return a list of valid promotions
     */
    public List<PromotionsResponseDTO.Promotion> retrieveValidPromotions(String startDateString, String endDateString) {

        Instant startDate = Instant.parse(startDateString);
        Date startDateAsDate = Date.from(startDate);
        Instant endDate = Instant.parse(endDateString);
        Date endDateAsDate = Date.from(endDate);
        int numberOfDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
        boolean isWeekend = isWeekend(startDateAsDate, endDateAsDate);
        boolean isLongWeekend = isLongWeekend(startDateAsDate, endDateAsDate);
        log.info(numberOfDays + "");
        return getFilteredPromotions(numberOfDays).stream()
                .filter(promotion ->
                        (isWeekend && promotion.getPromotionTitle().equals("Weekend discount")) ||
                                (isLongWeekend && promotion.getPromotionTitle().equals("Long weekend discount")) ||

                                (!promotion.getPromotionTitle().equals("Long weekend discount") &&
                                        !promotion.getPromotionTitle().equals("Weekend discount") &&
                                        !promotion.getPromotionTitle().equals("SENIOR_CITIZEN_DISCOUNT"))
                ).toList();
    }


    /**
     * Retrieves a custom promotion based on a promo code request.
     *
     * @param promoCodeRequestDTO the promo code request DTO
     * @return the custom promotion
     */
    public PromotionsResponseDTO.Promotion getCustomPromotion(PromoCodeRequestDTO promoCodeRequestDTO) {

        RoomDetails roomDetails = roomDetailsRepository.findById(promoCodeRequestDTO.getRoomTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Room Type not found with ID: " + promoCodeRequestDTO.getRoomTypeId()));


        List<String> userDefinedPromotions = Arrays.asList(roomDetails.getUserDefinedPromotionsArray());
        if (!userDefinedPromotions.contains(promoCodeRequestDTO.getPromoCode())) {
            throw new EntityNotFoundException("Promotion not valid for the room type");
        }
        UserPromotion userPromotion = userPromotionsRepository.findPromotionByTitleAndMinDays(promoCodeRequestDTO.getPromoCode(), promoCodeRequestDTO.getMinDays());
        if (userPromotion == null) {
            throw new EntityNotFoundException("Promotion not valid as your minimum number of stay is less than required");
        }
        return MapperService.toDTO(userPromotion);
    }

}
