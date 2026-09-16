"use client"

import { useEffect } from "react"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUpdateSalaryMutation } from "@/redux/api/employeeAdminApi"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X, DollarSign } from "lucide-react"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { SelectField } from "@/components/forms/select-field"
import type { Salary } from "@/redux/api/employeeApi"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const JOB_TITLES = [
  "Instructor",
  "Senior Visualizer",
  "Visualizer",
  "Video Editor",
  "Design And Social Media Coordinator",
  "Web Developer",
  "Marketing Executive",
  "Community Growth Manager",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

const MONTH_OPTIONS = MONTHS.map((m) => ({ value: m, label: m }))
const YEAR_OPTIONS = YEARS.map((y) => ({ value: String(y), label: String(y) }))
const JOB_TITLE_OPTIONS = JOB_TITLES.map((t) => ({ value: t, label: t }))
const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
]

const editSalarySchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  amount: z.string().min(1, "Amount is required"),
  bonus: z.string().optional(),
  paymentDate: z.string().optional(),
  status: z.enum(["Paid", "Pending"]),
})

type EditSalaryFormValues = z.infer<typeof editSalarySchema>

interface Props {
  open: boolean
  salary: Salary | null
  onClose: () => void
}

export function EditSalaryDialog({ open, salary, onClose }: Props) {
  const [updateSalary, { isLoading }] = useUpdateSalaryMutation()

  const form = useForm<EditSalaryFormValues>({
    resolver: zodResolver(editSalarySchema) as Resolver<EditSalaryFormValues>,
    defaultValues: {
      jobTitle: "",
      month: MONTHS[new Date().getMonth()],
      year: String(currentYear),
      amount: "",
      bonus: "",
      paymentDate: "",
      status: "Pending",
    },
  })

  useEffect(() => {
    if (salary) {
      form.reset({
        jobTitle: salary.jobTitle,
        month: salary.month,
        year: String(salary.year),
        amount: String(salary.amount),
        bonus: salary.bonus ? String(salary.bonus) : "",
        paymentDate: salary.paymentDate
          ? new Date(salary.paymentDate).toISOString().split("T")[0]
          : "",
        status: salary.status,
      })
    }
  }, [salary, form])

  const watchedAmount = useWatch({ control: form.control, name: "amount" })
  const watchedBonus = useWatch({ control: form.control, name: "bonus" })

  const handleSubmit = async (values: EditSalaryFormValues) => {
    if (!salary) return
    try {
      await updateSalary({
        id: salary._id,
        jobTitle: values.jobTitle,
        month: values.month,
        year: Number(values.year),
        amount: Number(values.amount),
        bonus: values.bonus ? Number(values.bonus) : undefined,
        paymentDate: values.paymentDate || undefined,
        status: values.status,
      }).unwrap()
      toast.success("Salary record updated!")
      onClose()
    } catch {
      toast.error("Failed to update salary record.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 z-10 bg-background">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Edit Salary Record</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Update payroll details for <span className="font-semibold">{salary?.employeeName}</span>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-5 space-y-4">
            <SelectField name="jobTitle" label="Job Title" options={JOB_TITLE_OPTIONS} required />

            <div className="grid grid-cols-2 gap-3">
              <SelectField name="month" label="Month" options={MONTH_OPTIONS} />
              <SelectField name="year" label="Year" options={YEAR_OPTIONS} />
            </div>

            <InputField
              name="amount"
              label="Gross Salary (৳)"
              type="number"
              placeholder="e.g. 50000"
              required
            />

            <InputField
              name="bonus"
              label="Bonus (৳) (optional)"
              type="number"
              placeholder="e.g. 5000"
            />

            <SelectField name="status" label="Status" options={STATUS_OPTIONS} />

            <InputField
              name="paymentDate"
              label="Payment Date (optional)"
              type="date"
            />

            {watchedAmount && (
              <div className="bg-muted rounded-lg border px-4 py-3 space-y-1.5 text-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Summary</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Salary</span>
                  <span className="font-semibold">৳ {Number(watchedAmount).toLocaleString()}</span>
                </div>
                {watchedBonus && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus</span>
                    <span className="font-semibold">৳ {Number(watchedBonus).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1.5 font-bold">
                  <span>Total Payable</span>
                  <span>৳ {(Number(watchedAmount) + Number(watchedBonus || 0)).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2 min-w-[130px]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isLoading ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
