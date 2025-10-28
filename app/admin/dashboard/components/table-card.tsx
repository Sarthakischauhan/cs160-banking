import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataFormatter } from "@/lib/utils";
import { DataTable } from "./data-table";

interface TableCardProps {
  title: string;
  description: string;
  data: Array<Record<string, any>>;
  disable?: string[];
}

/**
 * A Card for displaying data in a table
 * 
 * @param title Title of the card
 * @param description Description put under the title of the card
 * @param data Tabular data which populates the table
 * @param disable Array of keys to be removed
 * @returns Full formatted table component
 */
export function TableCard({
  title,
  description,
  data,
  disable,
}: TableCardProps) {
  return (
    <>
      <Card className="h-full gap-4 py-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <DataTable data={data} disable={disable} />
        </CardContent>
      </Card>
    </>
  );
}
