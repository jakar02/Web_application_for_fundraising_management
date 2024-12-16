package com.restApp.charityApp.usermodel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "account_details")
public class AccountDetails {

    @Id
    @Column(name = "transaction_id")
    private String transactionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "collection_id")
    private UserCollection userCollection;

    @Column(name = "debtor_name")
    private String debtorName;

    @Column(name = "iban")
    private String iban;

    @Column(name = "transaction_currency")
    private String transactionCurrency;

    @Column(name = "transaction_amount")
    private String transactionAmount;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "value_date")
    private LocalDate valueDate;

    @Column(name = "remmitance_information_unstructured")
    private String remittanceInformationUnstructured;
}
