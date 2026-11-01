"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { useCreateRefundMutation } from "@/redux/api/refundApi"

const refundSchema = z.object({
  transactionId: z.string().min(3, "Transaction ID is required"),
  reason: z.string().min(3, "Reason is required").max(500, "Max 500 characters"),
})

type RefundFormValues = z.infer<typeof refundSchema>

export function RefundCreateDialog({
  open,
  onOpenChange,
  defaultTransactionId = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTransactionId?: string
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [createRefund] = useCreateRefundMutation()

  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema) as Resolver<RefundFormValues>,
    defaultValues: { transactionId: defaultTransactionId, reason: "" },
  })

  const handleSubmit = async (values: RefundFormValues) => {
    setIsSaving(true)
    try {
      await createRefund(values).unwrap()
      toast.success("Refund request created — approve it to proceed")
      form.reset({ transactionId: defaultTransactionId, reason: "" })
      onOpenChange(false)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || "Failed to create refund request")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Issue Refund</DialogTitle>
          <DialogDescription>
            Creates a pending refund for the full paid amount. An admin must approve, then complete it. For manual
            (PhonePe) payments the money is returned outside the gateway.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField name="transactionId" label="Transaction ID" placeholder="TXN-..." required />
            <TextareaField
              name="reason"
              label="Reason"
              placeholder="Why is this payment being refunded?"
              rows={4}
              required
            />
            <SubmitButton className="w-full" disabled={isSaving} loadingText="Creating...">
            Create Refund Request
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}