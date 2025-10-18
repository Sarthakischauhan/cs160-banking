import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
interface WelcomeCardProps {
    firstName: string
}
export function WelcomeCard({firstName} : WelcomeCardProps) {
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {firstName}!</CardTitle>
                <CardDescription>This is your dashboard!</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Recap today's spending, your balance, and keep up with your finances! All on one app!</p>
            </CardContent>
            <CardFooter />
        </Card>
        </>
    )
}