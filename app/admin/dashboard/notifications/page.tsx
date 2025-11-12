import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  return (
    <div className="w-full h-full">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Transactions</h1>
        <form method="GET" className="flex flex-col gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div>
            <Button type="submit">Apply Filters</Button>
          </div>
          <div className="w-full h-20 grid grid-cols-4 gap-4 py-4">
          </div>
        </form>
      </div>
    </div>
  );
}
