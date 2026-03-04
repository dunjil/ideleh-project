import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SetupRlsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>RLS Setup (Deprecated)</CardTitle>
          <CardDescription>
            Row Level Security is a Supabase concept no longer used in this project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This project has been migrated to a self-hosted PostgreSQL database. Access control is now handled
            at the application layer using middleware, cookie-based sessions, and API route guards.
          </p>
          <p className="text-muted-foreground">
            To initialize the database schema, run:
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
