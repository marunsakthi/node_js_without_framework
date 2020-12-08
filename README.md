# Banking API

## Objective

CREATE TABLE user(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PASSWORD VARCHAR(50) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE bank_account(
   id INT NOT NULL AUTO_INCREMENT,
   customer_id VARCHAR(100) NOT NULL,
   accountname VARCHAR(200) NOT NULL,
   accountholder VARCHAR(200) NOT NULL,
   ifsc_code VARCHAR(200) NOT NULL,
   accountnumber VARCHAR(200) NOT NULL,
   deposit_amount VARCHAR(200) NOT NULL,
   PRIMARY KEY ( id )
);

CREATE TABLE transfer_amount(
   id INT NOT NULL AUTO_INCREMENT,
   customer_id VARCHAR(100) NOT NULL,
   account_id VARCHAR(200) NOT NULL,
   amount VARCHAR(200) NOT NULL,
   PRIMARY KEY ( id )
);

CREATE TABLE transfer_history(
   id INT NOT NULL AUTO_INCREMENT,
   customer_id VARCHAR(100) NOT NULL,
   account_id VARCHAR(200) NOT NULL,
   status VARCHAR(400) NOT NULL,
   PRIMARY KEY ( id )
);

CREATE TABLE customer(
   id INT NOT NULL AUTO_INCREMENT,
   customer_name VARCHAR(100) NOT NULL,
   customer_mobile VARCHAR(200) NOT NULL,
   customer_address VARCHAR(200) NOT NULL, 
   PRIMARY KEY ( id )
);


//http://localhost:3000/retrieve_transfer_history => history Of Transfer
body:
{
    "customer_id": "1",
    "account_id": "1"
}

response:

[
    {
        "id": 1,
        "customer_id": "1",
        "account_id": "1",
        "status": "1 Id Trasnfer The Amount Using This Account 1"
    }
]

//http://localhost:3000/transfer_amount =>Transfer Amount
Body:

{
    "customer_id": "1",
    "account_id": "1",
    "accountname": "SBI",
    "amount": "10"
}

//http://localhost:3000/getallBankaccount_customers

Response:

[
    {
        "id": 1,
        "customer_id": "1",
        "accountname": "SBI",
        "accountholder": "Arisha Barron",
        "ifsc_code": "SBI12345",
        "accountnumber": "12345678912",
        "deposit_amount": "9980"
    },
    {
        "id": 2,
        "customer_id": "1",
        "accountname": "ICICI",
        "accountholder": "Arisha Barron",
        "ifsc_code": "ICICI12345",
        "accountnumber": "12345678912",
        "deposit_amount": "5"
    },
    {
        "id": 3,
        "customer_id": "1",
        "accountname": "RBI",
        "accountholder": "Arisha Barron",
        "ifsc_code": "RBI12345",
        "accountnumber": "12345678912",
        "deposit_amount": "5"
    }
]

//Create a new bank account for a customer, with an initial deposit amount.
//http://localhost:3000/account
body:
{
    "customer_id": "1",
    "account_id": "1",
    "amount": "Arisha Barron",
    "ifsc_code": "SBI12345",
    "accountnumber": "12345678912",
    "deposit_amount": "200"
}


