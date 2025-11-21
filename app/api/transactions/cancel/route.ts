import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const role = getRole(session);
    if (!role.includes("Admin")) {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    const { transaction_id } = await req.json();
    if (!transaction_id) {
      return NextResponse.json(
        { message: "transaction_id required" },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: { transaction_id },
    });

    if (!tx) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (tx.transaction_status === "CANCELED") {
      return NextResponse.json(
        { message: "Transaction already cancelled" },
        { status: 400 }
      );
    }

    if (tx.transaction_status === "PENDING") {
      await prisma.transaction.update({
        where: { transaction_id },
        data: { transaction_status: "CANCELED" },
      });

      return NextResponse.json(
        {
          message: "Pending transaction cancelled successfully",
        },
        { status: 200 }
      );
    }

    // Determine the reversal type
    const getReverseType = (type: string) => {
      switch (type) {
        case "DEPOSIT":
          return "WITHDRAWAL";
        case "WITHDRAWAL":
          return "DEPOSIT";
        case "TRANSFER":
          return "TRANSFER";
        default:
          return type;
      }
    };

    const reverseType = getReverseType(tx.transaction_type);

    await prisma.$transaction(async (txDB) => {
      console.log(">> CANCELLING TRANSACTION", transaction_id);

      // Mark original as canceled
      await txDB.transaction.update({
        where: { transaction_id },
        data: { transaction_status: "CANCELED" },
      });

      // Create a reversal transaction
      let reversalData: any = {
        account_id:
          tx.transaction_type === "TRANSFER" ? tx.account_id2 : tx.account_id,
        account_id2:
          tx.transaction_type === "TRANSFER" ? tx.account_id : tx.account_id,
        amount: tx.amount,
        description: `Reversal of transaction ${transaction_id}`,
        transaction_type: reverseType,
        transaction_status: "PENDING", // handled automatically by worker
      };

      console.log(">> CREATING REVERSAL TRANSACTION", reversalData);

      await txDB.transaction.create({ data: reversalData });

      console.log(">> CANCELATION COMPLETE");
    });

    return NextResponse.json(
      { message: "Transaction cancelled successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return NextResponse.json(
      { message: "Failed to cancel transaction", error: error?.message },
      { status: 500 }
    );
  }
});
