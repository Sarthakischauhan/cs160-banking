import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change = 0,
  description,
}: MetricCardProps) {
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
          <div className="flex text-3xl font-bold">
            {value}{" "}
            <span className="self-center px-2">
              {change > 0 ? (
                <TrendingUp color="#3a88fe" />
              ) : (
                <TrendingDown color="#ff6251" />
              )}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {change} in the past month
          </div>
        </CardContent>
      </Card>
    </>
  );
}
