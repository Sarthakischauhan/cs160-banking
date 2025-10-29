import {
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { AccountForm }  from "./components/account-form";
import { WalletMinimal } from "lucide-react"

export default async function createAccount(){
  return (
    <>
      <Card className="w-1/2 max-w-2xl mx-auto my-10 px-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <WalletMinimal className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Open a bank account</CardTitle>
          <CardDescription>
            Please provide the following information to open your bank account.  
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>
    </>
  )
}