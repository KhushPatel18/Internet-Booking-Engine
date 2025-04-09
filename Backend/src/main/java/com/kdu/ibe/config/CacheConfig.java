package com.kdu.ibe.config;


import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.RemovalCause;
import com.github.benmanes.caffeine.cache.RemovalListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.concurrent.TimeUnit;

import static java.util.Arrays.asList;  // Import from java.util.Arrays

@Configuration
@EnableCaching
@Slf4j
@EnableScheduling
public class CacheConfig {

    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .maximumSize(30)
                .expireAfterAccess(24, TimeUnit.HOURS)// time bases eviction
                .removalListener(new CustomRemovalListener());
    }

    @Bean("caffeineCacheManager")
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
        caffeineCacheManager.setCaffeine(caffeineConfig());
        caffeineCacheManager.setCacheNames(asList("nightly-rates", "promotions"));
        return caffeineCacheManager;
    }

    private static class CustomRemovalListener implements RemovalListener<Object, Object> {
        @Override
        public void onRemoval(Object key, Object value, RemovalCause cause) {

            log.info("Cache entry removed - Key: " + key + ", Value: " + value.toString() + ", Cause: " + cause);
        }

    }}
