package com.kdu.ibe.util;

import com.kdu.ibe.dto.request.RoomRequestDTO;

public class Queries {
    public static String getPropertyById = "query { getProperty(where: { property_name: \"Team 12 Hotel\" }) { property_id property_name property_address contact_number } }";

    public static String getNightlyRate(int propertyId) {
        return "query MyQuery { getProperty(where: {property_id: " + propertyId + "}) { room_type { room_rates { room_rate { basic_nightly_rate date } } } } }";
    }


    public static final String PROPERTY_ROOM_TYPES_LIST = "{listRoomAvailabilities(where: {booking_id: {equals: 0}, property_id: {equals: 12}, date: {gte: \\\"%s\\\", lte: \\\"%s\\\"}} take: 10000) { room { room_type { room_type_name } } date room_id } listRoomRateRoomTypeMappings(where:{room_rate:{date:{gte:\\\"%s\\\",lte:\\\"%s\\\"}},room_type:{property_id:{equals:12}}} take: 1000){room_rate{basic_nightly_rate date} room_type{ room_type_name }} }";

    public static String dateRateMapping = "query MyQuery { listRoomRateRoomTypeMappings( where: {room_type_id: {equals: %d}, room_rate: {date: {gte: \"%s\", lt: \"%s\"}}} take: 1000 ) { room_rate { basic_nightly_rate date } } }";

    public static String listRoomAvailability = "query MyQuery { listRoomAvailabilities(take: %d where: {booking_id: {equals: 0}, property_id: {equals: %d}, room: {room_type_id: {equals: %d}}, date: {gte: \"%s\", lte: \"%s\"}} orderBy: {room_id: ASC}) { room_id availability_id } }";


    public static String CancelBookingMutation = "mutation cancelBooking { " +
            "updateBooking( " +
            "where: {booking_id: %d} " +
            "data: {booking_status: {connect: {status_id: %d}}} " +
            ") { " +
            "booking_id " +
            "status_id " +
            "} " +
            "}";

    public static String cancelRoomAvailabilityMutation = "mutation cancelBooking { " +
            "updateRoomAvailability( " +
            "where: {availability_id: %d} " +
            "data: {booking: {connect: {booking_id: %d}}} " +
            ") { " +
            "property_id " +
            "room_id " +
            "room { " +
            "room_type_id " +
            "} " +
            "} " +
            "}";

    public static String CreateBookingMutation = "mutation MyMutation { createBooking(data: {check_in_date: \"%s\", check_out_date: \"%s\", adult_count: %d, child_count: %d, total_cost: %d, amount_due_at_resort: %d, booking_status: {connect: {status_id: %d}}, guest: {create: {guest_name: \"%s\"}}, property_booked: {connect: {property_id: %d}}}) {booking_id}}";
    public static String UpdateRoomAvailability = "mutation updateAvailibility { updateRoomAvailability(where: {availability_id: %d}, data: {booking: {connect: {booking_id: %d}}}) {availability_id booking_id room_id}}";
}
