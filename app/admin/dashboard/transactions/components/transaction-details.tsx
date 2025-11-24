import { TextCopy } from "@/components/ui/copy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

export function TransactionDetailsButton({
  transaction,
}: {
  transaction: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // ⬅️ Prevent dropdown closing
        >
          View Details
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p>
              <strong>ID:</strong> {transaction.transaction_id}
            </p>
            <TextCopy text={transaction.transaction_id} />
          </div>
          <p>
            <strong>From:</strong>{" "}
            {transaction.Account.Customer.first_name +
              " " +
              transaction.Account.Customer.last_name}
          </p>
          {transaction.Account_Transaction_account_id2ToAccount.Customer ? (
            <p>
              <strong>To:</strong>{" "}
              {transaction.Account_Transaction_account_id2ToAccount.Customer
                .first_name +
                " " +
                transaction.Account_Transaction_account_id2ToAccount.Customer
                  .last_name}
            </p>
          ) : (
            <p>
              <strong>To:</strong>{" "}
              {transaction.Account.Customer.first_name +
                " " +
                transaction.Account.Customer.last_name}
            </p>
          )}
          <p>
            <strong>Type:</strong> {transaction.transaction_type}
          </p>
          <p>
            <strong>Amount:</strong> {formatCurrency(transaction.amount)}
          </p>
          <p>
            <strong>Balance Before:</strong>{" "}
            {["DEPOSIT", "TRANSFER"].includes(transaction.transaction_type)
              ? formatCurrency(
                  transaction.amount_after_transaction - transaction.amount,
                )
              : formatCurrency(
                  transaction.amount_after_transaction + transaction.amount,
                )}
          </p>
          <p>
            <strong>Balance After:</strong>{" "}
            {formatCurrency(transaction.amount_after_transaction)}
          </p>
          <p></p>
          <p>
            <strong>Status:</strong> {transaction.transaction_status}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(transaction.created_at).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
