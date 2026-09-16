"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail } from "lucide-react"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { useSendNewsUpdateMutation } from "@/redux/api/adminApi"

const newsSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Max 200 characters"),
  message: z.string().min(1, "Message is required"),
})

type NewsFormValues = z.infer<typeof newsSchema>

export default function NewsUpdatesCard() {
  const [sendNewsUpdate, { isLoading }] = useSendNewsUpdateMutation()

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema) as Resolver<NewsFormValues>,
    defaultValues: { subject: "", message: "" },
  })

  const handleSubmit = async (values: NewsFormValues) => {
    try {
      const result = await sendNewsUpdate(values).unwrap()
      toast.success(result.message || `News update sent to ${result.data.count} enrolled students!`, {
        description: <span className="text-foreground/50">Emails have been queued and will be sent shortly.</span>,
      })
      form.reset()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      toast.error("Failed to send news update", {
        description: <span className="text-foreground/50">{err?.data?.message || "Please try again later."}</span>,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>News & Updates</CardTitle>
            <CardDescription className="mt-1">
              Send announcements to all enrolled students
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField
              name="subject"
              label="Subject"
              placeholder="e.g., New Course Launch, Schedule Update..."
              maxLength={200}
              required
            />
            <TextareaField
              name="message"
              label="Message"
              placeholder="Write your announcement here... (HTML supported)"
              rows={8}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              You can use HTML tags for formatting (e.g., &lt;strong&gt;, &lt;a href=&quot;&quot;&gt;, &lt;br&gt;)
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Send to all students with active or completed enrollments</span>
            </div>
            <SubmitButton className="w-full" disabled={isLoading} loadingText="Sending...">
              Send News Update
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
