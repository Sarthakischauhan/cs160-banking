-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING', 'SAVINGS');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('CLOSED', 'OPEN', 'PENDING');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('CANCEL', 'SUSPEND', 'DELETE', 'OTHER', 'BUG', 'APPROVE');

-- CreateTable
CREATE TABLE "Account" (
    "account_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit_amount" DECIMAL,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "account_type" "AccountType" NOT NULL DEFAULT 'CHECKING',

    CONSTRAINT "account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "CardInfo" (
    "cardNum" BIGSERIAL NOT NULL,
    "cardPin" SMALLINT NOT NULL,
    "accountID" UUID NOT NULL,
    "expiry_date" DATE,

    CONSTRAINT "cardInfo_pkey" PRIMARY KEY ("accountID")
);

-- CreateTable
CREATE TABLE "Checks" (
    "check_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6),
    "front_image" TEXT,
    "back_image" TEXT,
    "updated_at" TIMESTAMPTZ(6),
    "deposit_date" TIMESTAMPTZ(6),
    "deposit_amount" DECIMAL,
    "transactionId" UUID NOT NULL,
    "check_approved" BOOLEAN NOT NULL DEFAULT false,
    "front_text" TEXT,
    "back_text" TEXT,

    CONSTRAINT "Checks_pkey" PRIMARY KEY ("check_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth0_user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "account_type" TEXT,
    "monthly_income" DOUBLE PRECISION,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "DepositTest" (
    "transactionId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID,
    "amount" DECIMAL NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepositTest_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "Email" (
    "email_id" TEXT NOT NULL,
    "email_name" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "notification" BIGINT,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("email_id")
);

-- CreateTable
CREATE TABLE "Login" (
    "login_id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" UUID,
    "login_attempts" SMALLINT,
    "login_sucess" BOOLEAN,
    "email" BYTEA,
    "password" BYTEA,
    "user_type" BYTEA,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("login_id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notification_type" TEXT,
    "customer" UUID,
    "message" TEXT,
    "delivery_method" TEXT,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statements" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" UUID,
    "customer_id" UUID,
    "statement_pdf" BYTEA,

    CONSTRAINT "Statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id2" UUID,
    "description" TEXT,
    "transaction_status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_type" "TransactionType" NOT NULL DEFAULT 'DEPOSIT',
    "amount_after_transaction" DECIMAL,
    "scheduled" TIMESTAMPTZ(6),

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "sticket_id" BIGSERIAL NOT NULL,
    "customer_id" UUID NOT NULL,
    "handler_id" UUID,
    "account_id" UUID,
    "transaction_id" UUID,
    "message" TEXT NOT NULL,
    "ticket_status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "ticket_type" "TicketType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "subject" TEXT,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("sticket_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Checks_check_id_key" ON "Checks"("check_id");

-- CreateIndex
CREATE UNIQUE INDEX "Checks_transactionId_key" ON "Checks"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_auth0_user_id_key" ON "Customer"("auth0_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_name_key" ON "Email"("email_name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "account_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CardInfo" ADD CONSTRAINT "cardInfo_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Checks" ADD CONSTRAINT "Checks_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_notification_fkey" FOREIGN KEY ("notification") REFERENCES "Notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Statements" ADD CONSTRAINT "Statements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Statements" ADD CONSTRAINT "Statements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id2_fkey" FOREIGN KEY ("account_id2") REFERENCES "Account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_handler_id_fkey" FOREIGN KEY ("handler_id") REFERENCES "Customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
