package com.kdu.ibe.util;

import com.kdu.ibe.exception.custom.UnprocessableEntityException;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {


    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");


    // format i want ==>  2024-03-30T00:00:00.000Z
    // format that function giving ==> 2024-03-30T00:00:00Z
    public static String formatDate(Date date) {
        LocalDate localDate = date.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        return localDate.atStartOfDay().toInstant(ZoneOffset.UTC).toString();
    }

    public static String formatDateWithMilliseconds(Date date) {
        return date.toInstant().atOffset(ZoneOffset.UTC).format(formatter);
    }


    // format i want ==>  2024-03-30T00:00:00.000Z
    public static boolean verifyDates(String checkInDate, String checkOutDate) {
        try {
            LocalDate parsedCheckInDate = LocalDate.parse(checkInDate, formatter);
            LocalDate parsedCheckOutDate = LocalDate.parse(checkOutDate, formatter);
            return parsedCheckInDate.isBefore(parsedCheckOutDate);
        } catch (Exception e) {
            return false;
        }
    }

    public static Timestamp parseStringToTimestamp(String dateString) {
        try {
            // Create SimpleDateFormat object with the given format
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

            // Parse the string to Date object
            Date date = dateFormat.parse(dateString);

            return new Timestamp(date.getTime());
        } catch (ParseException e) {
            throw new UnprocessableEntityException("error parsing date to timestamp in cancel booking");
        }
    }

    public static Timestamp setTimestampTimeToZero(Timestamp timestamp) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(timestamp.getTime());
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return new Timestamp(calendar.getTimeInMillis());
    }
}
