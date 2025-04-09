package com.kdu.ibe.service;


import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import com.kdu.ibe.dto.graphql.RoomAvailabilityDTO;
import com.kdu.ibe.dto.graphql.RoomRateRoomTypeMappingDTO;
import com.kdu.ibe.dto.request.PriceRange;
import com.kdu.ibe.dto.request.RatingUpdateRequestDTO;
import com.kdu.ibe.dto.request.RoomRequestDTO;
import com.kdu.ibe.dto.response.*;
import com.kdu.ibe.entity.Feedback;
import com.kdu.ibe.entity.RoomDetails;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.repository.RoomDetailsRepository;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;


@Service
@Slf4j
public class RoomService {

    @Value("${graphql.client.url}")
    private String url;

    @Value("${API_KEY}")
    private String apikey;


    private final ThirdPartyAPIService thirdPartyAPIService;
    private final RoomDetailsRepository roomDetailsRepository;

    private final PromotionService promotionService;
    private final FeedbackService feedbackService;


    public RoomService(ThirdPartyAPIService thirdPartyAPIService, RoomDetailsRepository roomDetailsRepository, PromotionService promotionService, FeedbackService feedbackService) {
        this.thirdPartyAPIService = thirdPartyAPIService;
        this.roomDetailsRepository = roomDetailsRepository;
        this.promotionService = promotionService;

        this.feedbackService = feedbackService;
    }

    /**
     * Searches for rooms based on the provided parameters and returns a paginated list of room cards.
     * This method performs a GraphQL query to fetch room availabilities and room rate mappings,
     * processes the data, applies filters, and sorts the results before returning a paginated list of room cards.
     *
     * @param roomRequestDTO the request DTO containing room search parameters
     * @param page           the page number for pagination
     * @param pageSize       the number of items per page for pagination
     * @return a RoomCardsResponseDTO object containing the paginated list of room cards
     */
    public RoomCardsResponseDTO searchRoomsByParams(RoomRequestDTO roomRequestDTO, int page, int pageSize) {

        String graphqlQuery = getGraphqlQuery(roomRequestDTO);

        String rateQuery = "query MyQuery { " + "  listRoomRateRoomTypeMappings(" + "    where: {" + "      room_rate: {" + "        date: {gte: \"" + roomRequestDTO.getStartDate() + "\", lte: \"" + roomRequestDTO.getEndDate() + "\"}" + "      }," + "      room_type: {" + "        property_id: {equals: " + roomRequestDTO.getPropertyId() + "}" + "      }" + "    }" + "  take: 10000) {" + "    room_rate {" + "      basic_nightly_rate" + "    }" + "    room_type {" + "      room_type_id" + "    }" + "  }" + "}";

        long startTime = System.nanoTime();
        CompletableFuture<RoomAvailabilityDTO> roomAvailabilityFuture = CompletableFuture.supplyAsync(() -> thirdPartyAPIService.getPayload(RoomAvailabilityDTO.class, graphqlQuery));
        CompletableFuture<RoomRateRoomTypeMappingDTO> roomRateRoomTypeFuture = CompletableFuture.supplyAsync(() -> thirdPartyAPIService.getPayload(RoomRateRoomTypeMappingDTO.class, rateQuery));


        return CompletableFuture.allOf(roomAvailabilityFuture, roomRateRoomTypeFuture).thenApply(ignoredVoid -> {
            // when everything goes fine on thread side no Exception
            try {
                long endTime = System.nanoTime();
                long duration = endTime - startTime;
                double seconds = (double) duration / 1_000_000_000.0;
                log.info("task ran on parallel with execution time " + seconds);
                RoomAvailabilityDTO roomAvailabilityResponse = roomAvailabilityFuture.get();
                RoomRateRoomTypeMappingDTO roomRateRoomTypeResponse = roomRateRoomTypeFuture.get();
                return processData(roomRequestDTO, roomAvailabilityResponse, roomRateRoomTypeResponse, page, pageSize);
            } catch (Exception e) {
                log.error("Fail to execute room result queries in parallel trying synchronous");
                RoomAvailabilityDTO roomAvailabilityResponse = thirdPartyAPIService.getPayload(RoomAvailabilityDTO.class, graphqlQuery);
                RoomRateRoomTypeMappingDTO roomRateRoomTypeResponse = thirdPartyAPIService.getPayload(RoomRateRoomTypeMappingDTO.class, rateQuery);
                long endTime = System.nanoTime();
                long duration = endTime - startTime;
                double seconds = duration / 1_000_000_000.0;
                log.info("task ran on synchronously with execution time " + seconds);
                return processData(roomRequestDTO, roomAvailabilityResponse, roomRateRoomTypeResponse, page, pageSize);
            }
        }).join();
    }

    @NotNull
    private static String getGraphqlQuery(RoomRequestDTO roomRequestDTO) {
        int maxOccupancy = (roomRequestDTO.getAdults() + roomRequestDTO.getKids() + roomRequestDTO.getTeens() + roomRequestDTO.getSeniorCitizen()) / roomRequestDTO.getRooms();
        return "query MyQuery { " + "  listRoomAvailabilities(" + "    where: {" + "      property_id: {equals: " + roomRequestDTO.getPropertyId() + "}," + "      booking_id: {equals: 0}," + "      date: {gte: \"" + roomRequestDTO.getStartDate() + "\", lte: \"" + roomRequestDTO.getEndDate() + "\"}," + "      room: {" + "        room_type: {" + "          max_capacity: {gte: " + maxOccupancy + "}" + "        }" + "      }" + "    }" + "  take: 1000000) {" + "    room {" + "      room_id" + "      room_type {" + "        room_type_name" + "        room_type_id" + "        max_capacity" + "        double_bed" + "        area_in_square_feet" + "        single_bed" + "      }" + "    }" + "    date" + "  }" + "}";
    }

    /**
     * Processes the data fetched from the third-party API and returns a RoomCardsResponseDTO object.
     * This method combines room availability and rate mapping data, applies filters and sorts, and paginates the results.
     *
     * @param roomRequestDTO           the request DTO containing room search parameters
     * @param roomAvailabilityResponse the DTO containing room availability data
     * @param roomRateRoomTypeResponse the DTO containing room rate and room type mapping data
     * @param page                     the page number for pagination
     * @param pageSize                 the number of items per page for pagination
     * @return a RoomCardsResponseDTO object containing the paginated list of room cards
     */
    private RoomCardsResponseDTO processData(RoomRequestDTO roomRequestDTO, RoomAvailabilityDTO roomAvailabilityResponse, RoomRateRoomTypeMappingDTO roomRateRoomTypeResponse, int page, int pageSize) {
        Map<Long, Double> RoomTypeToAvgPriceMap = getAveragePrice(roomRateRoomTypeResponse);
        Map<Long, RoomResponseDTO> RoomTypeToRoomTypeDetails = getRoomTypeDetails(roomAvailabilityResponse);
        Map<Long, HashSet<Long>> RoomTypeToRoomId = getRoomTypesRoomId(roomAvailabilityResponse);

        LocalDate startDate = LocalDate.parse(roomRequestDTO.getStartDate().substring(0, 10));
        LocalDate endDate = LocalDate.parse(roomRequestDTO.getEndDate().substring(0, 10));

        int numberOfDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
        List<RoomCardDTO> roomCardDTOList = combineResults(RoomTypeToAvgPriceMap, RoomTypeToRoomTypeDetails, RoomTypeToRoomId, roomRequestDTO.getRooms(), numberOfDays, isLongWeekend(startDate, endDate), isWeekend(startDate, endDate), isSeniorCitizen(roomRequestDTO.getSeniorCitizen()));

        // apply filters

        // room type filter
        if (!Objects.isNull(roomRequestDTO.getRoomTypes()) && !roomRequestDTO.getRoomTypes().isEmpty()) {
            List<String> roomTypes = roomRequestDTO.getRoomTypes();
            roomCardDTOList = roomCardDTOList.stream().filter(roomCardDTO -> roomTypes.contains(roomCardDTO.getRoomTypeName())).toList();
        }

        if (!Objects.isNull(roomRequestDTO.getBeds())) {
            roomCardDTOList = roomCardDTOList.stream().filter(roomCardDTO -> roomCardDTO.getSingleBeds() + roomCardDTO.getDoubleBeds() >= roomRequestDTO.getBeds()).toList();
        }

        // bed type filter
        if (!Objects.isNull(roomRequestDTO.getBedTypes()) && !roomRequestDTO.getBedTypes().isEmpty()) {
            List<String> bedTypes = roomRequestDTO.getBedTypes();
            roomCardDTOList = roomCardDTOList.stream().filter(roomCardDTO -> {
                if (bedTypes.contains("Single bed") && bedTypes.contains("Double bed")) {
                    return roomCardDTO.getSingleBeds() > 0 && roomCardDTO.getDoubleBeds() > 0;
                } else if (bedTypes.contains("Single bed")) {
                    return roomCardDTO.getSingleBeds() > 0;
                } else if (bedTypes.contains("Double bed")) {
                    return roomCardDTO.getDoubleBeds() > 0;
                }
                return true;
            }).toList();
        }


        // price range filter
        if (!Objects.isNull(roomRequestDTO.getPriceRange())) {
            PriceRange priceRanges = roomRequestDTO.getPriceRange();
            roomCardDTOList = roomCardDTOList.stream().filter(roomCardDTO -> priceRanges.getMax() >= roomCardDTO.getAverageRoomRate() && roomCardDTO.getAverageRoomRate() >= priceRanges.getMin()).toList();
        }

        // sort filters

        // sort by rate
        if (!Objects.isNull(roomRequestDTO.getSortRate())) {
            String sortType = roomRequestDTO.getSortRate();
            Comparator<RoomCardDTO> comparator = Comparator.comparing(RoomCardDTO::getAverageRoomRate);

            if ("ASC".equals(sortType)) {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator).toList();
            } else {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator.reversed()).toList();
            }
        }

        // sort by ratings
        // Sort by rating
        if (!Objects.isNull(roomRequestDTO.getSortRating())) {
            String sortType = roomRequestDTO.getSortRating();
            Comparator<RoomCardDTO> comparator = Comparator.comparing(RoomCardDTO::getRating);

            if ("ASC".equals(sortType)) {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator).toList();
            } else {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator.reversed()).toList();
            }
        }

        // Sort by review
        if (!Objects.isNull(roomRequestDTO.getSortReview())) {
            String sortType = roomRequestDTO.getSortReview();
            Comparator<RoomCardDTO> comparator = Comparator.comparing(RoomCardDTO::getReview);

            if ("ASC".equals(sortType)) {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator).toList();
            } else {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator.reversed()).toList();
            }
        }

        // Sort by name
        if (!Objects.isNull(roomRequestDTO.getSortName())) {
            String sortType = roomRequestDTO.getSortName();
            Comparator<RoomCardDTO> comparator = Comparator.comparing(RoomCardDTO::getRoomTypeName);

            if ("ASC".equals(sortType)) {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator).toList();
            } else {
                roomCardDTOList = roomCardDTOList.stream().sorted(comparator.reversed()).toList();
            }
        }


        // paginate and send
        int startIdx = page * pageSize;
        int endIdx = Math.min(startIdx + pageSize, roomCardDTOList.size());
        int length = roomCardDTOList.size();
        roomCardDTOList = roomCardDTOList.subList(startIdx, endIdx);
        return new RoomCardsResponseDTO(length, roomCardDTOList);
    }

    /**
     * Determines if a date range represents a long weekend.
     * This method checks if the start and end dates span a weekend, including both Saturday and Sunday.
     *
     * @param startDate the start date of the range
     * @param endDate   the end date of the range
     * @return true if the date range is a long weekend, false otherwise
     */
    public static boolean isLongWeekend(LocalDate startDate, LocalDate endDate) {
        LocalDate date = startDate;

        while (!date.isAfter(endDate)) {
            if (date.getDayOfWeek().getValue() == 6) { // Saturday
                LocalDate nextDay = date.plusDays(1);
                if (nextDay.isAfter(endDate)) {
                    return false;
                } else {
                    if (nextDay.getDayOfWeek().getValue() == 7) { // Sunday
                        return true;
                    }
                }
            }
            date = date.plusDays(1);
        }
        return false;
    }

    /**
     * Determines if a date range represents a weekend.
     * This method checks if the start and end dates are both on a weekend (Saturday or Sunday).
     *
     * @param startDate the start date of the range
     * @param endDate   the end date of the range
     * @return true if the date range is a weekend, false otherwise
     */
    private boolean isWeekend(LocalDate startDate, LocalDate endDate) {
        return startDate.getDayOfWeek() == DayOfWeek.SATURDAY && endDate.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    private boolean isSeniorCitizen(int seniorCitizenCount) {
        return seniorCitizenCount > 0;
    }


    /**
     * Combines room availability and rate mapping data to create a list of RoomCardDTO objects.
     * This method processes the data, applies filters, and sorts the results before returning a list of RoomCardDTO objects.
     *
     * @param roomTypeToAvgPriceMap     a map of room type IDs to average prices
     * @param roomTypeToRoomTypeDetails a map of room type IDs to room type details
     * @param roomTypeToRoomId          a map of room type IDs to room IDs
     * @param roomsRequired             the number of rooms required
     * @param minimumNumberOfDays       the minimum number of days for which the promotions are applicable
     * @param isLongWeekend             flag indicating if it's a long weekend
     * @param isWeekend                 flag indicating if it's a weekend
     * @param isSeniorCitizen           flag indicating if the user is a senior citizen
     * @return a list of RoomCardDTO objects representing the available rooms
     */

    private List<RoomCardDTO> combineResults(Map<Long, Double> roomTypeToAvgPriceMap, Map<Long, RoomResponseDTO> roomTypeToRoomTypeDetails, Map<Long, HashSet<Long>> roomTypeToRoomId, Integer roomsRequired, int minimumNumberOfDays, boolean isLongWeekend, boolean isWeekend, boolean isSeniorCitizen) {

        List<RoomCardDTO> roomCardDTOList = new ArrayList<>();
        // everyone get same right now
        Optional<PromotionsResponseDTO.Promotion> promotion = promotionService.retrieveMinimumPromotions(minimumNumberOfDays, isLongWeekend, isWeekend, isSeniorCitizen);
        roomTypeToRoomTypeDetails.forEach((roomTypeId, roomResponseDTO) -> {

            if (roomTypeToRoomId.get(roomTypeId).size() >= roomsRequired) {
                log.info(roomTypeId + " has rooms : " + roomTypeToRoomId.get(roomTypeId));
                RoomDetails roomDetails = roomDetailsRepository.findById(roomTypeId).orElseThrow(() -> new EntityNotFoundException("Room Type is not present in your database to retrieve configurable info about RoomType, Please Add it"));
                Optional<String> promoString = null;
                if (promotion.isPresent()) {
                    promoString = Optional.of("Save " + Math.ceil((1 - promotion.get().getPriceFactor()) * 100) + "%" + " on applying " + promotion.get().getPromotionTitle());
                }
                RoomCardDTO roomCardDTO = RoomCardDTO.builder().roomTypeId(roomTypeId).roomTypeName(roomResponseDTO.getRoomTypeName()).maxCapacity(roomResponseDTO.getMaxCapacity()).doubleBeds(roomResponseDTO.getDoubleBeds()).singleBeds(roomResponseDTO.getSingleBeds()).area(roomResponseDTO.getArea()).averageRoomRate(roomTypeToAvgPriceMap.get(roomTypeId)).carouselImages(roomDetails.getCarouselImages()).rating(roomDetails.getRating()).review(roomDetails.getReview()).bestPromotion(promoString).build();
                roomCardDTOList.add(roomCardDTO);
            } else {
                log.info("this room type has not enough rooms " + roomTypeId + " this are the rooms available " + roomTypeToRoomId.get(roomTypeId).size());
            }
        });
        return roomCardDTOList;
    }

    /**
     * Maps room type IDs to a set of room IDs available for those types.
     * This method iterates over room availabilities and groups room IDs by their room type IDs.
     *
     * @param roomAvailabilityResponse the DTO containing room availability data
     * @return a Map where keys are room type IDs and values are sets of room IDs
     */
    private Map<Long, HashSet<Long>> getRoomTypesRoomId(RoomAvailabilityDTO roomAvailabilityResponse) {
        Map<Long, HashSet<Long>> roomTypeToRoomIdsMap = new HashMap<>();
        roomAvailabilityResponse.getData().getListRoomAvailabilities().forEach(roomAvailability -> {
            Long roomTypeId = roomAvailability.getRoom().getRoomType().getRoomTypeId();
            Long roomId = roomAvailability.getRoom().getRoomId();
            if (!roomTypeToRoomIdsMap.containsKey(roomTypeId)) {
                roomTypeToRoomIdsMap.put(roomTypeId, new HashSet<>());
            }
            roomTypeToRoomIdsMap.get(roomTypeId).add(roomId);
        });
        return roomTypeToRoomIdsMap;
    }

    /**
     * Maps room type IDs to their details, including room type name, area, date, number of double beds, single beds, and max capacity.
     * This method iterates over room availabilities and groups room type details by their room type IDs.
     *
     * @param roomAvailabilityResponse the DTO containing room availability data
     * @return a Map where keys are room type IDs and values are RoomResponseDTO objects containing room type details
     */
    private Map<Long, RoomResponseDTO> getRoomTypeDetails(RoomAvailabilityDTO roomAvailabilityResponse) {
        Map<Long, RoomResponseDTO> roomTypeToRoomTypeDetails = new HashMap<>();
        roomAvailabilityResponse.getData().getListRoomAvailabilities().forEach(roomAvailability -> {
            Long roomTypeId = roomAvailability.getRoom().getRoomType().getRoomTypeId();
            RoomAvailabilityDTO.RoomType roomType = roomAvailability.getRoom().getRoomType();
            if (!roomTypeToRoomTypeDetails.containsKey(roomTypeId)) {
                roomTypeToRoomTypeDetails.put(roomTypeId, RoomResponseDTO.builder().roomTypeName(roomType.getRoomTypeName()).area(roomType.getAreaInSquareFeet()).date(roomAvailability.getDate()).doubleBeds(roomType.getDoubleBed()).singleBeds(roomType.getSingleBed()).maxCapacity(roomType.getMaxCapacity()).roomTypeId(roomTypeId).build());
            }
        });
        return roomTypeToRoomTypeDetails;
    }

    /**
     * Calculates and maps room type IDs to their average nightly rate.
     * This method iterates over room rate and room type mappings, calculates the average nightly rate for each room type, and returns a map of room type IDs to average prices.
     *
     * @param roomRateRoomTypeResponse the DTO containing room rate and room type mapping data
     * @return a Map where keys are room type IDs and values are the average nightly rates for those room types
     */
    private Map<Long, Double> getAveragePrice(RoomRateRoomTypeMappingDTO roomRateRoomTypeResponse) {
        Map<Long, Double> roomTypeToAvgPriceMap = new HashMap<>();
        Map<Long, RateProcessClass> roomTypeToAvgPriceCalcMap = new HashMap<>();
        roomRateRoomTypeResponse.getData().getListRoomRateRoomTypeMappings().forEach(roomRateRoomTypeMapping -> {
            double nightlyRate = roomRateRoomTypeMapping.getRoomRate().getBasicNightlyRate();
            Long roomTypeId = roomRateRoomTypeMapping.getRoomType().getRoomTypeId();
            if (!roomTypeToAvgPriceCalcMap.containsKey(roomTypeId)) {
                roomTypeToAvgPriceCalcMap.put(roomTypeId, new RateProcessClass(nightlyRate, 1));
            } else {
                roomTypeToAvgPriceCalcMap.get(roomTypeId).addToSum(nightlyRate);
                roomTypeToAvgPriceCalcMap.get(roomTypeId).addToCount();
            }
        });
        roomTypeToAvgPriceCalcMap.forEach((key, value) -> {
            Double avgPrice = (value.getSum() / value.getCount());
            roomTypeToAvgPriceMap.put(key, avgPrice);
        });
        return roomTypeToAvgPriceMap;
    }

    /**
     * Updates the rating and review count for a room type based on a rating update request.
     * This method calculates the new rating by averaging the existing ratings and the new rating, updates the room details in the repository, and submits feedback.
     *
     * @param ratingUpdateRequestDTO the request DTO containing the rating update information
     * @return a RatingUpdateResponseDTO object containing the updated rating and review count
     */
    public RatingUpdateResponseDTO updateRating(RatingUpdateRequestDTO ratingUpdateRequestDTO) {
        RoomDetails roomDetails = roomDetailsRepository.findFirstByRoomTypeName(ratingUpdateRequestDTO.getRoomTypeName()).orElseThrow(() -> new EntityNotFoundException("Room Name is not present in your database to update rating"));
        double ratings = roomDetails.getRating();
        int reviews = roomDetails.getReview();
        double newRating = (ratings * reviews + ratingUpdateRequestDTO.getRating()) / (reviews + 1);
        roomDetailsRepository.updateRatingAndReviewById(ratingUpdateRequestDTO.getRoomTypeName(), newRating, reviews + 1);
        Feedback feedback = Feedback.builder()
                .feedbackId(ratingUpdateRequestDTO.getFeedbackId())
                .feedbackContent(ratingUpdateRequestDTO.getFeedback())
                .rating(ratingUpdateRequestDTO.getRating())
                .isSubmitted(true)
                .roomTypeId(roomDetails.getRoomTypeId())
                .build();
        feedbackService.submitFeedback(feedback);
        return RatingUpdateResponseDTO.builder().rating(roomDetails.getRating()).reviews(roomDetails.getReview()).build();
    }

    /**
     * A helper class for processing and calculating average prices for room types.
     * This class contains methods to add values to the sum and count used for calculating the average price.
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class RateProcessClass {
        private double sum;
        private int count;

        public void addToSum(double value) {
            this.sum += value;
        }

        public void addToCount() {
            this.count += 1;
        }
    }

}


