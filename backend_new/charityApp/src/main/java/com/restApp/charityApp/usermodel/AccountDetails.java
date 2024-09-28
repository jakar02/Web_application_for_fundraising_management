package com.restApp.charityApp.usermodel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Setter
@Getter
@Table(name = "account_details")
public class BankDetails {

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
    private Date bookingDate;

    @Column(name = "value_date")
    private Date valueDate;

    @Column(name = "remmitance_information_unstructured")
    private String remittanceInformationUnstructured;
}
