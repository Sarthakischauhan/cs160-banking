import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { dataFormatter } from "@/lib/utils";

export function DataTable({
  data,
  disable,
}: {
  data: Array<Record<string, any>>;
  disable?: string[];
}) {
  return (
    <Table className="border-2 rounded-2xl">
      <TableHeader>
        <TableRow>
          {data.length > 0 &&
            Object.keys(data[0]).map((key: string, idx: number) => {
              return disable ? (
                <TableHead hidden={disable.includes(key)} key={idx}>
                  {key}
                </TableHead>
              ) : (
                <TableHead key={idx}>{key}</TableHead>
              );
            })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 &&
          data.map((object: Record<string, any>, key) => {
            return (
              <TableRow key={key} className="text-wrap">
                {Object.entries(object).map(([key, value], idx) => {
                  return disable ? (
                    <TableCell hidden={disable.includes(key)} key={idx}>
                      {dataFormatter[key] ? dataFormatter[key](value) : value}
                    </TableCell>
                  ) : (
                    <TableCell key={idx}>
                      {dataFormatter[key] ? dataFormatter[key](value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
