"use client"

import { useForm, useWatch, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useGetAllEmployeesQuery, useAddSalaryMutation } from "@/redux/api/employeeAdminApi"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Save, X, User, DollarSign } from "lucide-react"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/forms/input-field"
import { SelectField } from "@/components/forms/select-field"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

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

const MONTH_OPTIONS = MONTHS.map((m) => ({ value: m, label: m }))
const YEAR_OPTIONS = YEARS.map((y) => ({ value: String(y), label: String(y) }))
const JOB_TITLE_OPTIONS = JOB_TITLES.map((t) => ({ value: t, label: t }))

const addSalarySchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  jobTitle: z.string().min(1, "Job title is required"),
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  amount: z.string().min(1, "Amount is required"),
  bonus: z.string().optional(),
  paymentDate: z.string().optional(),
})

type AddSalaryFormValues = z.infer<typeof addSalarySchema>

interface Props {
  open: boolean
  onClose: () => void
}

export function AddSalaryDialog({ open, onClose }: Props) {
  const [addSalary, { isLoading }] = useAddSalaryMutation()
  const { data: empData } = useGetAllEmployeesQuery({ limit: 100 })
  const employees = empData?.data?.employees ?? []

  const form = useForm<AddSalaryFormValues>({
    resolver: zodResolver(addSalarySchema) as Resolver<AddSalaryFormValues>,
    defaultValues: {
      employeeId: "",
      jobTitle: "",
      month: MONTHS[new Date().getMonth()],
      year: String(currentYear),
      amount: "",
      bonus: "",
      paymentDate: "",
    },
  })

  const watchedAmount = useWatch({ control: form.control, name: "amount" })
  const watchedBonus = useWatch({ control: form.control, name: "bonus" })

  const reset = () => form.reset({
    employeeId: "", jobTitle: "",
    month: MONTHS[new Date().getMonth()], year: String(currentYear),
    amount: "", bonus: "", paymentDate: "",
  })

  const handleEmployeeSelect = (id: string) => {
    form.setValue("employeeId", id, { shouldValidate: true })
  }

  const handleSubmit = async (values: AddSalaryFormValues) => {
    const employee = employees.find((e) => e._id === values.employeeId)
    if (!employee) { toast.error("Please select an employee."); return }

    try {
      await addSalary({
        employeeId: values.employeeId,
        employeeName: employee.name,
        jobTitle: values.jobTitle,
        month: values.month,
        year: Number(values.year),
        amount: Number(values.amount),
        bonus: values.bonus ? Number(values.bonus) : undefined,
        paymentDate: values.paymentDate || undefined,
      }).unwrap()
      toast.success("Salary record created!")
      reset()
      onClose()
    } catch {
      toast.error("Failed to create salary record.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose() } }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 z-10 bg-background">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Add Salary Record</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Create a new payroll entry for an employee.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Employee
              </Label>
              <Controller
                name="employeeId"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={handleEmployeeSelect} disabled={isLoading}>
                    <SelectTrigger aria-invalid={!!form.formState.errors.employeeId}>
                      <SelectValue placeholder="Select employee…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-52">
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.name} — <span className="text-muted-foreground text-xs">{emp.email}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.employeeId && (
                <p className="text-sm font-medium text-destructive" role="alert">{form.formState.errors.employeeId.message}</p>
              )}
            </div>

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
              <Button type="button" variant="outline" onClick={() => { reset(); onClose() }} disabled={isLoading} className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2 min-w-[130px]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isLoading ? "Saving…" : "Create Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
