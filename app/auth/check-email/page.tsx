import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link to verify your email address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your email and click the confirmation link to complete your registration. After confirming,
              you'll be able to log in and start using VolConnect.
            </p>
            <Link href="/auth/login" className="text-primary hover:underline text-sm">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
