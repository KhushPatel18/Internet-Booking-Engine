package com.kdu.ibe.dto.ConfigurationsDTOs;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SortingFilterDTO {
    @NotEmpty
    private String field;

    @NotNull
    private Boolean both;
}
