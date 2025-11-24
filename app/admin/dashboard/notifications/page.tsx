import { Button } from "@/components/ui/button";
import { getNotifications } from "@/lib/admin/adminData";
import NotificationTable from "./components/notification-table";
import { Notifications } from "@prisma/client";
import { PaginationControls, RangeFilter, SelectFilter, TextFilter } from "../components/filters";

enum NotificationType {
  TRANSACTION = "TRANSACTION",
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams;
  const pageSize = 20;
  const {
    firstName = "",
    lastName = "",
    notificationType = "",
    dismissed = "",
    minDate = "",
    maxDate = "",
    cursor = undefined
  } = await params

  const notifications = await getNotifications(params, cursor, pageSize);
  console.log(notifications);

  const nextCursor = notifications.length >= pageSize ? notifications[notifications.length - 1].id.toString() : null;

  return (
    <div className="w-full h-full">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Notifications</h1>
        <form method="GET" className="flex flex-col gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div className="w-full h-20 grid grid-cols-4 gap-4 py-4">
            <TextFilter
              label={"First Name"}
              name="firstName"
              value={firstName}
            />
            <TextFilter label={"Last Name"} name="lastName" value={lastName} />
            <SelectFilter
              label={"Notification Type"}
              options={Object.keys(NotificationType)}
              name="notificationType"
              value={notificationType}
            />
            <SelectFilter
              label={"Dismissed"}
              options={["True", "False"]}
              name="dismissed"
              value={dismissed}
            />
          </div>
          <div className="w-full h-20 grid grid-cols-4 gap-4 py-4">
            <RangeFilter
              label={"Date"}
              minName="minDate"
              maxName="maxDate"
              minValue={minDate}
              maxValue={maxDate}
              type="date"
            />
          </div>
        </form>
        <p className="font-bold w-full border-b-2">Notifications</p>
        <div className="w-full h-[calc(100%-100px)] flex justify-center items-center py-6">
          <NotificationTable notifications={notifications} />
        </div>
        <PaginationControls nextCursor={nextCursor} />
      </div>
    </div>
  );
}
