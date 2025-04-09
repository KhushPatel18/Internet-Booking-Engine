package com.kdu.ibe.service;


import com.kdu.ibe.dto.graphql.*;
import com.kdu.ibe.dto.request.BookRoomsRequestDTO;
import com.kdu.ibe.dto.request.BookingConcurrentRequestDTO;
import com.kdu.ibe.dto.request.IternaryInfoRequestDTO;
import com.kdu.ibe.dto.response.ErrorDTO;

import com.kdu.ibe.entity.PreBooking;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.repository.BookingRepository;
import com.kdu.ibe.repository.PreBookingRepository;
import com.kdu.ibe.util.DateUtils;
import com.kdu.ibe.util.Queries;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kdu.ibe.util.DateUtils.parseStringToTimestamp;
import static com.kdu.ibe.util.DateUtils.setTimestampTimeToZero;


/**
 * Service class for handling concurrent booking operations.
 */
@Service
@Slf4j
public class BookingConcurrentService {

    private final PreBookingRepository preBookingRepository;
    private final ThirdPartyAPIService thirdPartyAPIService;

    private final BookingRepository bookingRepository;

    public BookingConcurrentService(PreBookingRepository preBookingRepository, ThirdPartyAPIService thirdPartyAPIService, BookingRepository bookingRepository) {
        this.preBookingRepository = preBookingRepository;
        this.thirdPartyAPIService = thirdPartyAPIService;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Method to book rooms concurrently.
     *
     * @param bookingRequestDTO The BookingConcurrentRequestDTO containing booking details.
     * @param roomsRequired     The number of rooms required.
     * @param dayToRoomsMap     The mapping of days to available rooms.
     * @return List of availabilities.
     */
    public List<Long> bookRoom(BookingConcurrentRequestDTO bookingRequestDTO, Long roomsRequired, Map<Long, List<Long>> dayToRoomsMap) {
        Timestamp startDate = setTimestampTimeToZero(new Timestamp(bookingRequestDTO.getStartDate().getTime()));
        Timestamp endDate = setTimestampTimeToZero(new Timestamp(bookingRequestDTO.getEndDate().getTime()));
        // booking every Room in the request
        List<Long> roomIds = bookingRequestDTO.getRoomIds();
        List<Long> savedBookings = new ArrayList<>();
        List<Long> availabilities = new ArrayList<>();
        long count = 0;
        for (Long roomId : roomIds) {
            if (preBookingRepository.existsByPropertyIdAndRoomTypeIdAndRoomIdAndStartDateAndEndDate(bookingRequestDTO.getPropertyId(), bookingRequestDTO.getRoomTypeId(), roomId, startDate, endDate)) {
                log.info("room already booked : " + roomId);
                continue;
            } else {
                try {
                    PreBooking preBooking = preBookingRepository.save(PreBooking.builder()
                            .propertyId(bookingRequestDTO.getPropertyId())
                            .roomTypeId(bookingRequestDTO.getRoomTypeId())
                            .roomId(roomId)
                            .startDate(startDate)
                            .endDate(endDate)
                            .email(bookingRequestDTO.getEmail())
                            .build());
                    savedBookings.add(preBooking.getPreBookingId());
                    count++;
                    availabilities.addAll(dayToRoomsMap.get(roomId));
                } catch (DataIntegrityViolationException ex) {
                    log.info("DataIntegrityViolationException :: Unable book room due to conflict with other booking " + ex.getMessage());
                } catch (Exception e) {
                    log.info("General exception :: " + e.toString());
                }
            }
            if (count == roomsRequired) {
                break;
            }
        }
        // manual roll back
        if (count < roomsRequired) {
            // delete all
            preBookingRepository.deleteAllByIdInBatch(savedBookings);
            log.info("id's deleted " + savedBookings);
            throw new UnprocessableEntityException("Booking Already exist for required rooms ! try other rooms or try for different date range");
        }
        return availabilities;
    }


    /**
     * Method to perform booking for multiple rooms.
     *
     * @param bookRoomsRequestDTO The BookRoomsRequestDTO containing booking details.
     * @return List of availabilities.
     */
    public List<Long> performBooking(BookRoomsRequestDTO bookRoomsRequestDTO) {

        // get available rooms
        List<RoomBookingAvailability.RoomAvailability> rooms = getAvailableRooms(bookRoomsRequestDTO);
        // allocate rooms
        Map<Long, List<Long>> dayToRoomsMap = getDayToRoomMappings(rooms);
        List<Long> allocatedRooms = allocateRooms(dayToRoomsMap, bookRoomsRequestDTO);

        // allocatedRooms are not enough
        if (allocatedRooms.size() < bookRoomsRequestDTO.getRoomsRequired()) {
            throw new UnprocessableEntityException("Not enough rooms to book try again on later time or date");
        }
        log.info("Allocated Rooms : " + allocatedRooms);
        BookingConcurrentRequestDTO bookingRequestDTO = BookingConcurrentRequestDTO.builder()
                .email(bookRoomsRequestDTO.getEmail())
                .roomIds(allocatedRooms)
                .roomTypeId(bookRoomsRequestDTO.getRoomTypeId())
                .propertyId(bookRoomsRequestDTO.getPropertyId())
                .endDate(bookRoomsRequestDTO.getEndDate())
                .startDate(bookRoomsRequestDTO.getStartDate())
                .build();
        // book room
        return bookRoom(bookingRequestDTO, bookRoomsRequestDTO.getRoomsRequired(), dayToRoomsMap);
    }

    /**
     * Method to perform booking using GraphQL.
     *
     * @param iternaryInfoRequestDTO The IternaryInfoRequestDTO containing itinerary information.
     * @return The ID of the booking.
     */
    public Long performBookingOnGraphql(IternaryInfoRequestDTO iternaryInfoRequestDTO) {

        if (!DateUtils.verifyDates(iternaryInfoRequestDTO.getCheckInDate(), iternaryInfoRequestDTO.getCheckOutDate())) {
            throw new UnprocessableEntityException("Date format is in valid please provide valid date format");
        }

        String createBooking = String.format(
                Queries.CreateBookingMutation
                , iternaryInfoRequestDTO.getCheckInDate(), iternaryInfoRequestDTO.getCheckOutDate(), iternaryInfoRequestDTO.getAdultCount(), iternaryInfoRequestDTO.getChildCount(), iternaryInfoRequestDTO.getTotalCost(), iternaryInfoRequestDTO.getAmountAtResort(), 1, iternaryInfoRequestDTO.getGuestName(), iternaryInfoRequestDTO.getPropertyId());

        CreateBookingResponseDTO createBookingResponseDTO = thirdPartyAPIService.getPayload(CreateBookingResponseDTO.class, createBooking);
        Long bookingId = createBookingResponseDTO.getData().getCreateBooking().getBookingId();

        iternaryInfoRequestDTO.getAvailabilities().forEach(availabilityId -> {
            String updateRoomAvailability = String.format(Queries.UpdateRoomAvailability, availabilityId, bookingId);
            UpdateRoomAvailabilityResponseDTO updateRoomAvailabilityResponseDTO = thirdPartyAPIService.getPayload(UpdateRoomAvailabilityResponseDTO.class, updateRoomAvailability);
            if (!updateRoomAvailabilityResponseDTO.getData().getUpdateRoomAvailability().getBookingId().equals(bookingId)) {
                throw new EntityNotFoundException("Error performing mutation for availability update for id " + availabilityId + "_ with booking id" + bookingId);
            }
            log.info("availability update for " + availabilityId + " to " + bookingId);
        });

        return bookingId;
    }


    /**
     * Method to cancel a booking.
     *
     * @param bookingId      The ID of the booking to be canceled.
     * @param availabilities The list of availabilities.
     * @param checkInDate    The check-in date.
     * @param checkOutDate   The check-out date.
     * @return ResponseEntity containing the cancellation status.
     */
    @Transactional
    public ResponseEntity<ErrorDTO> cancelBooking(Long bookingId, List<Long> availabilities, String checkInDate, String checkOutDate) {
        String updateBookingStatus = String.format(Queries.CancelBookingMutation, bookingId, 2);
        thirdPartyAPIService.getPayload(UpdateBookingResponseDTO.class, updateBookingStatus);
        // update room availabilities get  room,roomType,propertyId in response
        availabilities.forEach(availabilityId -> {
            String mutationQuery = String.format(Queries.cancelRoomAvailabilityMutation, availabilityId, 0);
            CancelBookingResponseDTO cancelBookingResponseDTO = thirdPartyAPIService.getPayload(CancelBookingResponseDTO.class, mutationQuery);
            log.info("availabilityId mutated " + availabilityId + " to bookingId " + 0);
            CancelBookingResponseDTO.RoomAvailability roomAvailability = cancelBookingResponseDTO.getData().getUpdateRoomAvailability();
            // clearing the pre booking table
            log.info(roomAvailability.getRoomId() + " removed");
            Timestamp checkInTimeStamp = setTimestampTimeToZero(parseStringToTimestamp(checkInDate));
            Timestamp checkOutTimeStamp = setTimestampTimeToZero(parseStringToTimestamp(checkOutDate));
            preBookingRepository.deleteByUniqueConstraints(roomAvailability.getPropertyId(), roomAvailability.getRoom().getRoomTypeId(), roomAvailability.getRoomId(), checkInTimeStamp, checkOutTimeStamp);
            log.info("Removed " + roomAvailability.getPropertyId() + " " + roomAvailability.getRoom().getRoomTypeId() + " " + roomAvailability.getRoomId() + " " + checkInTimeStamp + " " + checkOutTimeStamp);
        });
        // make is canceled
        int rows = bookingRepository.updateIsCanceledByBookingId(true, bookingId);
        log.info("rows affected by update in booking status " + rows);
        return ResponseEntity.ok(new ErrorDTO("Booking Canceled For " + bookingId, HttpStatus.OK));
    }


    /**
     * Allocates rooms based on the availability and the requested booking dates.
     *
     * @param dayToRoomsMap       a map of room IDs to lists of availability IDs for each day
     * @param bookRoomsRequestDTO the request DTO containing the booking details
     * @return a list of room IDs that are allocated for the booking
     */
    private List<Long> allocateRooms(Map<Long, List<Long>> dayToRoomsMap, BookRoomsRequestDTO bookRoomsRequestDTO) {
        List<Long> allocatedRooms = new ArrayList<>();
        Instant startDateInstant = bookRoomsRequestDTO.getStartDate().toInstant();
        Instant endDateInstant = bookRoomsRequestDTO.getEndDate().toInstant();

        // Get the LocalDate from Instant
        LocalDate startDate = startDateInstant.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endDateInstant.atZone(ZoneId.systemDefault()).toLocalDate();
        long requiredRoomAvailabilities = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        for (Map.Entry<Long, List<Long>> entry : dayToRoomsMap.entrySet()) {
            if (entry.getValue().size() >= requiredRoomAvailabilities) {
                allocatedRooms.add(entry.getKey());
            }
        }
        return allocatedRooms;
    }


    /**
     * Maps each day to a list of room IDs based on their availability.
     *
     * @param rooms a list of room availability objects
     * @return a map where each key is a room ID and the value is a list of availability IDs for that room
     */
    private Map<Long, List<Long>> getDayToRoomMappings(List<RoomBookingAvailability.RoomAvailability> rooms) {
        Map<Long, List<Long>> dayToRoomsMap = new HashMap<>();
        rooms.forEach(roomAvailability -> {
            if (!dayToRoomsMap.containsKey(roomAvailability.getRoomId())) {
                dayToRoomsMap.put(roomAvailability.getRoomId(), new ArrayList<>());
            }
            dayToRoomsMap.get(roomAvailability.getRoomId()).add(roomAvailability.getAvailabilityId());
        });
        return dayToRoomsMap;
    }

    /**
     * Retrieves a list of available rooms for a given booking request.
     *
     * @param bookRoomsRequestDTO the request DTO containing the booking details
     * @return a list of room availability objects
     */
    private List<RoomBookingAvailability.RoomAvailability> getAvailableRooms(BookRoomsRequestDTO bookRoomsRequestDTO) {
        final int take = 1000;
        final Long propertyId = bookRoomsRequestDTO.getPropertyId();
        final Long roomTypeId = bookRoomsRequestDTO.getRoomTypeId();
        final String startDate = DateUtils.formatDateWithMilliseconds((bookRoomsRequestDTO.getStartDate()));
        final String endDate = DateUtils.formatDateWithMilliseconds((bookRoomsRequestDTO.getEndDate()));
        String query = String.format(Queries.listRoomAvailability, take, propertyId, roomTypeId, startDate, endDate);
        RoomBookingAvailability roomBookingAvailability = thirdPartyAPIService.getPayload(RoomBookingAvailability.class, query);
        return roomBookingAvailability.getData().getListRoomAvailabilities();
    }


}
