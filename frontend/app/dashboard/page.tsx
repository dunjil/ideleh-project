import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskSetupCheck } from "@/components/dashboard/task-setup-check"
import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
              <TaskSetupCheck />
              <TaskList userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
