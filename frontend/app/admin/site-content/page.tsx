"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

export default function SiteContentPage() {
  const [activeTab, setActiveTab] = useState("mission")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [contentData, setContentData] = useState<Record<string, { title: string; content: string }>>({
    mission: { title: "", content: "" },
    vision: { title: "", content: "" },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSiteContent()
  }, [])

  const fetchSiteContent = async () => {
    try {
      const res = await fetch("/api/admin/site-content")
      const data = await res.json()
      const contentMap: Record<string, { title: string; content: string }> = {
        mission: { title: "Our Mission", content: "" },
        vision: { title: "Our Vision", content: "" },
      }
      data.forEach((item: any) => {
        contentMap[item.key] = { title: item.title || contentMap[item.key].title, content: item.content }
      })
      setContentData(contentMap)
    } catch {
      toast({ title: "Error", description: "Failed to load site content.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key: string, field: "title" | "content", value: string) => {
    setContentData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }))
  }

  const handleSave = async (key: string) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, title: contentData[key].title, content: contentData[key].content }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Content Saved", description: `The ${key} has been updated successfully.` })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save content.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading site content...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Site Content Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mission">Mission Statement</TabsTrigger>
          <TabsTrigger value="vision">Vision Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle>Edit Mission Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mission-title">Title</Label>
                <Input
                  id="mission-title"
                  value={contentData.mission.title}
                  onChange={(e) => handleInputChange("mission", "title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission-content">Content</Label>
                <Textarea
                  id="mission-content"
                  value={contentData.mission.content}
                  onChange={(e) => handleInputChange("mission", "content", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("mission")} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Mission Statement"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision">
          <Card>
            <CardHeader>
              <CardTitle>Edit Vision Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vision-title">Title</Label>
                <Input
                  id="vision-title"
                  value={contentData.vision.title}
                  onChange={(e) => handleInputChange("vision", "title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision-content">Content</Label>
                <Textarea
                  id="vision-content"
                  value={contentData.vision.content}
                  onChange={(e) => handleInputChange("vision", "content", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("vision")} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Vision Statement"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold">{contentData.mission.title}</h3>
              <p className="mt-2 whitespace-pre-wrap">{contentData.mission.content}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold">{contentData.vision.title}</h3>
              <p className="mt-2 whitespace-pre-wrap">{contentData.vision.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
