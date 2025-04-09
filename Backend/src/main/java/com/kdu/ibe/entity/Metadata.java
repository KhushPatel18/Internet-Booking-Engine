package com.kdu.ibe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class Metadata {

    private Timestamp createdAt;

    private Timestamp modifiedAt;

    private Timestamp deletedAt;

    private boolean isDeleted;

    @PrePersist
    public void prePersist() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    public void preUpdate() {
        this.modifiedAt = new Timestamp(System.currentTimeMillis());
    }

    @PreRemove
    public void preRemove() {
        this.deletedAt = new Timestamp(System.currentTimeMillis());
    }
}