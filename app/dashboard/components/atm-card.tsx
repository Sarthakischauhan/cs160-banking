import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ATMCard() {
  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Locate ATMs</CardTitle>
          <CardDescription>Chase ATMs Near You</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <span>In partnership with Chase Bank, all deposits and withdrawal from Chase ATMs are free of charge.</span>
          </div>
        </CardContent>
        <CardFooter className="h-full">
          <div className="w-full grid grid-cols-3">
            <div />
            <div />
            <div className="w-full">
              <Button variant="outline" className="hover:cursor-pointer">
                Locate
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
