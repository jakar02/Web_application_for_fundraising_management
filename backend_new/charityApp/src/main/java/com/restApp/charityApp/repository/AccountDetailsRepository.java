package com.restApp.charityApp.repository;

import com.restApp.charityApp.usermodel.AccountDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountDetailsRepository extends JpaRepository<AccountDetails, String> {
}
