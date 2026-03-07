"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { adminInsert, disableRlsForTable } from "@/lib/admin-bypass"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RlsBypassForm() {
  const [tableName, setTableName] = useState("")
  const [jsonData, setJsonData] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState<"insert" | "disable">("insert")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (action === "insert") {
        // Parse the JSON data
        let data
        try {
          data = JSON.parse(jsonData)
        } catch (error) {
          toast({
            title: "Invalid JSON",
            description: "Please enter valid JSON data",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        // Insert the data using the admin_insert function
        const { success, error } = await adminInsert(tableName, data)

        if (success) {
          toast({
            title: "Success",
            description: `Data inserted into ${tableName} successfully`,
          })
          setJsonData("")
        } else {
          toast({
            title: "Error",
            description: `Failed to insert data: ${error?.message || "Unknown error"}`,
            variant: "destructive",
          })
        }
      } else if (action === "disable") {
        // Disable RLS for the specified table
        const { success, error } = await disableRlsForTable(tableName)

        if (success) {
          toast({
            title: "Success",
            description: `RLS disabled for ${tableName} successfully`,
          })
        } else {
          toast({
            title: "Error",
            description: `Failed to disable RLS: ${error?.message || "Unknown error"}`,
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>RLS Bypass Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={(value) => setAction(value as "insert" | "disable")}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insert">Insert Data (Bypass RLS)</SelectItem>
                <SelectItem value="disable">Disable RLS for Table</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="e.g., events, gallery, etc."
              required
            />
          </div>

          {action === "insert" && (
            <div className="space-y-2">
              <Label htmlFor="jsonData">JSON Data</Label>
              <Textarea
                id="jsonData"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='{"title": "Example Event", "description": "This is an example"}'
                rows={6}
                required
              />
              <p className="text-xs text-gray-500">
                Enter the data as a JSON object. Include all required fields for the table.
              </p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : action === "insert"
                ? "Insert Data (Bypass RLS)"
                : "Disable RLS for Table"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
