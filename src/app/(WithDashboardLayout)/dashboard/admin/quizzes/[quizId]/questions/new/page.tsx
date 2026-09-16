"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { useCreateAdminQuestionMutation, useUpdateAdminQuestionMutation, useGetAdminQuestionByIdQuery } from "@/redux/api/quizApi";
import { QuestionImageUpload } from "@/components/quiz/QuestionImageUpload";
import { IContentBlock, IQuestion } from "@/types/quiz";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { extractApiData } from "@/lib/api-helpers";

interface OptionForm {
    type: 'text' | 'image' | 'text_image';
    text: string;
    imageUrl: string;
    altText: string;
}

export default function AdminQuestionEditorPage({
    params,
    searchParams,
}: {
    params: Promise<{ quizId: string }>;
    searchParams?: Promise<{ questionId?: string }>;
}) {
    const router = useRouter();
    const { quizId } = use(params);
    const resolvedSearchParams = searchParams ? use(searchParams) : {};
    const questionId = resolvedSearchParams?.questionId;

    const { data: existingQuestionData } = useGetAdminQuestionByIdQuery(questionId || "", { skip: !questionId });
    const existingQuestion = extractApiData<IQuestion>(existingQuestionData);
    const [createQuestion] = useCreateAdminQuestionMutation();
    const [updateQuestion] = useUpdateAdminQuestionMutation();

    const [questionType, setQuestionType] = useState<'mcq' | 'true_false'>('mcq');
    const [contentType, setContentType] = useState<'text' | 'image' | 'text_image'>('text');
    const [questionText, setQuestionText] = useState("");
    const [questionImage, setQuestionImage] = useState("");
    const [explanationText, setExplanationText] = useState("");
    const [marks, setMarks] = useState(1);
    const [zamesPoints, setZamesPoints] = useState(1);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [options, setOptions] = useState<OptionForm[]>([
        { type: 'text', text: '', imageUrl: '', altText: '' },
        { type: 'text', text: '', imageUrl: '', altText: '' },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingQuestion) {
            setQuestionType(existingQuestion.questionType as 'mcq' | 'true_false');
            setContentType(existingQuestion.content.type as 'text' | 'image' | 'text_image');
            setQuestionText(existingQuestion.content.text || "");
            setQuestionImage(existingQuestion.content.imageUrl || "");
            setExplanationText(existingQuestion.explanation?.text || "");
            setMarks(existingQuestion.marks);
            setZamesPoints(existingQuestion.zamesPoints);
            setCorrectAnswer(existingQuestion.correctAnswer || "");
            if (existingQuestion.options.length > 0) {
                setOptions(
                    existingQuestion.options.map((opt: IContentBlock) => ({
                        type: (opt.type as 'text' | 'image' | 'text_image') || 'text',
                        text: opt.text || "",
                        imageUrl: opt.imageUrl || "",
                        altText: opt.altText || "",
                    }))
                );
            }
        }
    }, [existingQuestion]);

    useEffect(() => {
        if (questionType === 'true_false') {
            setOptions([
                { type: 'text', text: 'True', imageUrl: '', altText: '' },
                { type: 'text', text: 'False', imageUrl: '', altText: '' },
            ]);
        }
    }, [questionType]);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, { type: 'text', text: '', imageUrl: '', altText: '' }]);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, field: keyof OptionForm, value: string) => {
        setOptions(options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)));
    };

    const buildContentBlock = (): IContentBlock => {
        if (contentType === 'image') {
            return { type: 'image', imageUrl: questionImage, altText: '' };
        }
        if (contentType === 'text_image') {
            return { type: 'text_image', text: questionText, imageUrl: questionImage, altText: '' };
        }
        return { type: 'text', text: questionText };
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const data: Partial<IQuestion> = {
                questionType: questionType as IQuestion["questionType"],
                content: buildContentBlock(),
                options: options.map(o => {
                    if (o.type === 'image') return { type: 'image', imageUrl: o.imageUrl, altText: o.altText };
                    if (o.type === 'text_image') return { type: 'text_image', text: o.text, imageUrl: o.imageUrl, altText: o.altText };
                    return { type: 'text', text: o.text };
                }),
                correctAnswer,
                marks,
                zamesPoints,
            };

            if (explanationText) {
                data.explanation = { type: 'text', text: explanationText };
            }

            if (questionId) {
                await updateQuestion({ questionId, data }).unwrap();
                toast.success("Question updated");
            } else {
                await createQuestion({ quizId, data }).unwrap();
                toast.success("Question created");
            }

            router.push(`/dashboard/admin/quizzes/${quizId}`);
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to save question");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardPageContainer
            heading={questionId ? "Edit Question" : "New Question"}
            subheading={questionId ? "Modify this question" : "Add a new question to the quiz"}
            buttons={
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            }
            content={
                <div className="space-y-6 max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Question Type</Label>
                                    <Select
                                        value={questionType}
                                        onValueChange={(v: 'mcq' | 'true_false') => {
                                            setQuestionType(v);
                                            setCorrectAnswer("");
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                                            <SelectItem value="true_false">True / False</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Content Type</Label>
                                    <Select value={contentType} onValueChange={(v: 'text' | 'image' | 'text_image') => setContentType(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text Only</SelectItem>
                                            <SelectItem value="image">Image Only</SelectItem>
                                            <SelectItem value="text_image">Text + Image</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {(contentType === 'text' || contentType === 'text_image') && (
                                <div>
                                    <Label>Question Text</Label>
                                    <Textarea
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Enter the question text"
                                        className="min-h-[80px]"
                                    />
                                </div>
                            )}

                            {(contentType === 'image' || contentType === 'text_image') && (
                                <QuestionImageUpload
                                    value={questionImage}
                                    onChange={setQuestionImage}
                                    label="Question Image"
                                />
                            )}

                            <div>
                                <Label>Explanation (optional)</Label>
                                <Textarea
                                    value={explanationText}
                                    onChange={(e) => setExplanationText(e.target.value)}
                                    placeholder="Explain why this answer is correct"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Marks</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={marks}
                                        onChange={(e) => setMarks(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <Label>Zames Points</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={zamesPoints}
                                        onChange={(e) => setZamesPoints(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Answer Options</CardTitle>
                            {questionType === 'mcq' && options.length < 6 && (
                                <Button variant="outline" size="sm" onClick={addOption}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Option
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {options.map((option, index) => (
                                <Card key={index} className={correctAnswer === String(index) ? 'border-l-4 border-l-green-500' : ''}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={correctAnswer === String(index)}
                                                    onChange={() => setCorrectAnswer(String(index))}
                                                    className="h-4 w-4"
                                                />
                                                <span className="text-sm font-mono font-bold">
                                                    {String.fromCharCode(65 + index)}.
                                                </span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {questionType === 'mcq' && (
                                                    <Select
                                                        value={option.type}
                                                        onValueChange={(v: 'text' | 'image' | 'text_image') => updateOption(index, 'type', v)}
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="image">Image</SelectItem>
                                                            <SelectItem value="text_image">Text + Image</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                {(option.type === 'text' || option.type === 'text_image') && (
                                                    <Input
                                                        value={option.text}
                                                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                                                        placeholder="Option text"
                                                    />
                                                )}
                                                {(option.type === 'image' || option.type === 'text_image') && (
                                                    <QuestionImageUpload
                                                        value={option.imageUrl}
                                                        onChange={(url) => updateOption(index, 'imageUrl', url)}
                                                        label={`Option ${String.fromCharCode(65 + index)} Image`}
                                                    />
                                                )}
                                            </div>
                                            {questionType === 'mcq' && options.length > 2 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button onClick={handleSubmit} disabled={isSaving}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : questionId ? "Update Question" : "Create Question"}
                        </Button>
                    </div>
                </div>
            }
        />
    );
}
