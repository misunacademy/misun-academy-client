"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import {
    useCreateQuizMutation,
    useUpdateQuizMutation,
    useGetQuizByIdQuery,
} from "@/redux/api/quizApi";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { QuizStatus } from "@/types/enums";

interface QuizForm {
    title: string;
    description: string;
    instructions: string;
    passingPercentage: number;
    timeLimit: number | undefined;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    allowReview: boolean;
    status: QuizStatus;
}

export default function AdminQuizBuilderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const moduleId = searchParams.get("moduleId") || "";
    const quizId = searchParams.get("quizId");

    const { data: existingQuiz } = useGetQuizByIdQuery(quizId || "", { skip: !quizId });
    const [createQuiz] = useCreateQuizMutation();
    const [updateQuiz] = useUpdateQuizMutation();
    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm<QuizForm>({
        defaultValues: {
            title: "",
            description: "",
            instructions: "",
            passingPercentage: 50,
            timeLimit: undefined,
            shuffleQuestions: false,
            shuffleOptions: false,
            maxAttempts: 1,
            showCorrectAnswers: false,
            allowReview: true,
            status: QuizStatus.Draft,
        },
    });

    useEffect(() => {
        if (existingQuiz) {
            reset({
                title: existingQuiz.title,
                description: existingQuiz.description || "",
                instructions: existingQuiz.instructions || "",
                passingPercentage: existingQuiz.passingPercentage,
                timeLimit: existingQuiz.timeLimit,
                shuffleQuestions: existingQuiz.shuffleQuestions,
                shuffleOptions: existingQuiz.shuffleOptions,
                maxAttempts: existingQuiz.maxAttempts,
                showCorrectAnswers: existingQuiz.showCorrectAnswers,
                allowReview: existingQuiz.allowReview,
                status: existingQuiz.status,
            });
        }
    }, [existingQuiz, reset]);

    const onSubmit = async (data: QuizForm) => {
        setIsSaving(true);
        try {
            if (quizId) {
                await updateQuiz({ quizId, data }).unwrap();
                toast.success("Quiz updated successfully");
                router.push(`/dashboard/admin/quizzes/${quizId}`);
            } else {
                if (!moduleId) {
                    toast.error("Module ID is required");
                    return;
                }
                await createQuiz({ moduleId, data }).unwrap();
                toast.success("Quiz created successfully");
                router.back();
            }
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to save quiz");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardPageContainer
            heading={quizId ? "Edit Quiz" : "Create Quiz"}
            subheading="Configure quiz settings"
            buttons={
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            }
            content={
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="e.g., Module 1 Quiz" />
                                    )}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder="Brief description of the quiz" />
                                    )}
                                />
                            </div>
                            <div>
                                <Label>Instructions</Label>
                                <Controller
                                    name="instructions"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            placeholder="Instructions shown to students before starting"
                                            className="min-h-[100px]"
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Grading & Time</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Passing Percentage (%)</Label>
                                    <Controller
                                        name="passingPercentage"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label>Time Limit (minutes, optional)</Label>
                                    <Controller
                                        name="timeLimit"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="No limit"
                                                value={field.value || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? Number(e.target.value) : undefined
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Max Attempts (0 = unlimited)</Label>
                                <Controller
                                    name="maxAttempts"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min={0}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Shuffle Questions</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Randomize question order for each attempt
                                    </p>
                                </div>
                                <Controller
                                    name="shuffleQuestions"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Shuffle Options</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Randomize answer option order
                                    </p>
                                </div>
                                <Controller
                                    name="shuffleOptions"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Show Correct Answers</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Display correct answers after submission
                                    </p>
                                </div>
                                <Controller
                                    name="showCorrectAnswers"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Allow Review</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow students to review their answers
                                    </p>
                                </div>
                                <Controller
                                    name="allowReview"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" disabled={isSaving}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Quiz"}
                        </Button>
                    </div>
                </form>
            }
        />
    );
}
