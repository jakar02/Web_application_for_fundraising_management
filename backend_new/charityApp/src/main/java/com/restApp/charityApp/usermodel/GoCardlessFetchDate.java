package com.restApp.charityApp.usermodel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "go_cardless_fetch_date")
public class GoCardlessFetchDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "last_fetch_date")
    private LocalDateTime lastFetchDate;

}
