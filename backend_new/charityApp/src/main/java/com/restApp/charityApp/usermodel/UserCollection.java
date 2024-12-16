package com.restApp.charityApp.usermodel;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "user_collection")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(name = "collection_goal")
    private String collectionGoal;

    @Column(name = "collection_amount", nullable = true)
    private Double collectionAmount = 0.0;

    @Column(name = "account_number")
    private String accountNumber;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "city")
    private String city;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "date_of_creation")
    private LocalDate dateOfCreation = LocalDate.now();

    @Column(name = "isActive")
    private boolean isActive = true;

    @Column(name = "collection_collected_amount")
    private Double collectionCollectedAmount = 0.0;

    @Column(name = "transferred")
    private Boolean transferred = false;

    @Column(name = "postedOnTwitter")
    private Boolean postedOnTwitter = false;

    @JsonManagedReference
    @OneToMany(mappedBy = "userCollection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCollectionImage> images;

    @Override
    public String toString() {
        return "UserCollection{id=" + id +
                ", collectionGoal='" + collectionGoal + '\'' +
                ", collectionAmount=" + collectionAmount +
                ", accountNumber='" + accountNumber + '\'' +
                ", description='" + description + '\'' +
                ", city='" + city + '\'' +
                ", date=" + date +
                '}';
    }

    public void setCollectedAmount(Double totalAmount) {
        collectionCollectedAmount = totalAmount;
    }
}
