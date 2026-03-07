"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function TaskList({ userId }: { userId: string }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to IDELEH Dashboard</CardTitle>
          <CardDescription>Your personal dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage your profile, view upcoming events, and access exclusive content here. Feature updates are coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
