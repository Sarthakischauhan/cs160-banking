export default function TransactionsPage() {
  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold">Transactions</h1>
      </div>
      <div className="w-full h-[calc(100%-100px)] flex justify-center items-center">
        <p className="text-2xl">No transactions to display.</p>
      </div>
    </div>
  );
}