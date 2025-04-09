package com.kdu.ibe.repository;


import com.kdu.ibe.entity.PromotionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionTemplateRepository extends JpaRepository<PromotionTemplate, Long>  {
}
