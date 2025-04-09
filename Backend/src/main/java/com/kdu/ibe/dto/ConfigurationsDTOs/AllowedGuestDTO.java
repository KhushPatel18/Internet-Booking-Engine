package com.kdu.ibe.dto.ConfigurationsDTOs;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllowedGuestDTO {
    @NotEmpty
    private String ages;

    @NotEmpty
    private String name;

    @NotNull
    private Boolean isActive;

    // Getters and setters
}
