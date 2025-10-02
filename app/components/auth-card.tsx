import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard() {
  return (
    <>
      <Card className="w-[60%]">
        <CardHeader className="justify-items-center">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
            
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <CardDescription>Or register an account.</CardDescription>
          <Button variant="outline" className="hover:cursor-pointer">Register</Button>
        </CardFooter>
      </Card>
    </>
  );
}
