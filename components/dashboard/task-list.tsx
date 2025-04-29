"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Check, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Task {
  id: string
  title: string
  is_complete: boolean
  user_id: string
  created_at: string
}

interface TaskListProps {
  userId: string
}

export function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (error: any) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()

    // Set up real-time subscription
    const subscription = supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTasks()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, toast])

  // Update the addTask function to ensure user_id is properly set
  const addTask = async () => {
    if (!newTask.trim()) return

    try {
      // Get the current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add tasks",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("tasks").insert([
        {
          title: newTask,
          user_id: user.id,
          is_complete: false,
        },
      ])

      if (error) {
        console.error("Insert error:", error)
        throw error
      }

      setNewTask("")
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const toggleTaskCompletion = async (taskId: string, isComplete: boolean) => {
    try {
      const { error } = await supabase.from("tasks").update({ is_complete: !isComplete }).eq("id", taskId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask()
          }}
        />
        <Button size="icon" onClick={addTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No tasks yet. Add one above!</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant={task.is_complete ? "default" : "outline"}
                    className="h-6 w-6"
                    onClick={() => toggleTaskCompletion(task.id, task.is_complete)}
                  >
                    {task.is_complete && <Check className="h-3 w-3" />}
                  </Button>
                  <span className={task.is_complete ? "text-muted-foreground line-through" : ""}>{task.title}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
