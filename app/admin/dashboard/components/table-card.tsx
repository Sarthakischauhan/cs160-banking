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

interface TableCardProps {
  title: string;
  description: string;
  data: Array<Record<string, any>>;
  optional?: number[];
}

export function TableCard({
  title,
  description,
  data,
  optional,
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
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {data &&
                  Object.keys(data[0]).map((key: string, i: number) => {
                    return optional?.includes(i) ? (
                      <TableHead className="hidden md:table-cell" key={i}>
                        {key}
                      </TableHead>
                    ) : (
                      <TableHead key={i}>{key}</TableHead>
                    );
                  })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.map((object: Record<string, any>, key) => {
                  return (
                    <TableRow key={key}>
                      {Object.values(object).map((value, key) => {
                        return optional?.includes(key) ? (
                          <TableCell className="hidden md:table-cell" key={key}>
                            {value}
                          </TableCell>
                        ) : (
                          <TableCell key={key}>{value}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
