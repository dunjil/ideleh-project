import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SetupAuthPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            This project uses a self-hosted PostgreSQL database with custom bcrypt authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Supabase authentication and RLS setup has been replaced by a custom authentication system.
            Authentication is handled via bcrypt password hashing and cookie-based sessions stored in the
            <code className="mx-1 rounded bg-muted px-1 font-mono text-sm">user_sessions</code> table.
          </p>
          <p className="text-muted-foreground">
            To initialize the database, run the schema against your PostgreSQL instance:
          </p>
          <pre className="overflow-auto rounded-md bg-muted p-4 text-xs">
            psql $DATABASE_URL -f schema.sql
          </pre>
          <div className="flex justify-end">
            <Button asChild variant="outline">
              <Link href="/admin">Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
