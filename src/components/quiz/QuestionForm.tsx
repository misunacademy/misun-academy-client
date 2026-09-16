"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuestionImageUpload } from "@/components/quiz/QuestionImageUpload";
import { IContentBlock, IQuestion } from "@/types/quiz";
import { QuestionType } from "@/types/enums";
import { Plus, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface OptionForm {
    type: "text" | "image" | "text_image";
    text: string;
    imageUrl: string;
    altText: string;
}

export interface QuestionFormValue {
    questionType: QuestionType;
    content: IContentBlock;
    options: IContentBlock[];
    correctAnswer: string;
    marks: number;
    zamesPoints: number;
    explanation?: IContentBlock;
}

export interface QuestionFormState {
    questionType: QuestionType;
    contentType: "text" | "image" | "text_image";
    questionText: string;
    questionImage: string;
    explanationText: string;
    marks: number;
    zamesPoints: number;
    correctAnswer: string;
    options: OptionForm[];
}

const EMPTY_OPTIONS: OptionForm[] = [
    { type: "text", text: "", imageUrl: "", altText: "" },
    { type: "text", text: "", imageUrl: "", altText: "" },
];

export function questionToFormState(q?: IQuestion | null): QuestionFormState {
    if (!q) {
        return {
            questionType: QuestionType.MCQ,
            contentType: "text",
            questionText: "",
            questionImage: "",
            explanationText: "",
            marks: 1,
            zamesPoints: 1,
            correctAnswer: "",
            options: EMPTY_OPTIONS.map((o) => ({ ...o })),
        };
    }
    return {
        questionType: q.questionType ?? QuestionType.MCQ,
        contentType: (q.content?.type as "text" | "image" | "text_image") ?? "text",
        questionText: q.content?.text || "",
        questionImage: q.content?.imageUrl || "",
        explanationText: q.explanation?.text || "",
        marks: q.marks ?? 1,
        zamesPoints: q.zamesPoints ?? 1,
        correctAnswer: q.correctAnswer || "",
        options:
            q.options && q.options.length > 0
                ? q.options.map((opt: IContentBlock) => ({
                      type: (opt.type as "text" | "image" | "text_image") || "text",
                      text: opt.text || "",
                      imageUrl: opt.imageUrl || "",
                      altText: opt.altText || "",
                  }))
                : EMPTY_OPTIONS.map((o) => ({ ...o })),
    };
}

export function buildQuestionPayload(state: QuestionFormState): Partial<IQuestion> {
    const {
        questionType,
        contentType,
        questionText,
        questionImage,
        explanationText,
        marks,
        zamesPoints,
        correctAnswer,
        options,
    } = state;
    let content: IContentBlock;
    if (contentType === "image") {
        content = { type: "image", imageUrl: questionImage, altText: "" };
    } else if (contentType === "text_image") {
        content = { type: "text_image", text: questionText, imageUrl: questionImage, altText: "" };
    } else {
        content = { type: "text", text: questionText };
    }
    const payload: Partial<IQuestion> = {
        questionType,
        content,
        options: options.map((o) => {
            if (o.type === "image") return { type: "image", imageUrl: o.imageUrl, altText: o.altText };
            if (o.type === "text_image")
                return { type: "text_image", text: o.text, imageUrl: o.imageUrl, altText: o.altText };
            return { type: "text", text: o.text };
        }),
        correctAnswer,
        marks,
        zamesPoints,
    };
    if (explanationText) {
        payload.explanation = { type: "text", text: explanationText };
    }
    return payload;
}

interface QuestionFormFieldsProps {
    initialQuestion?: IQuestion | null;
    resetSignal?: number;
    onChange?: (value: QuestionFormValue) => void;
    onValidityChange?: (valid: boolean) => void;
}

export function QuestionFormFields({
    initialQuestion,
    resetSignal,
    onChange,
    onValidityChange,
}: QuestionFormFieldsProps) {
    const [state, setState] = useState<QuestionFormState>(() => questionToFormState(initialQuestion));

    // Load / reset when the edited question changes or after a successful save
    useEffect(() => {
        setState(questionToFormState(initialQuestion));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuestion?._id, resetSignal]);

    // True/False always has exactly True + False options
    useEffect(() => {
        if (state.questionType === "true_false") {
            setState((prev) => ({
                ...prev,
                options: [
                    { type: "text", text: "True", imageUrl: "", altText: "" },
                    { type: "text", text: "False", imageUrl: "", altText: "" },
                ],
                correctAnswer: "",
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.questionType]);

    const optionValue = (index: number, opt: OptionForm) => opt.text || `option-${index}`;

    const valid =
        (state.contentType === "text" ? state.questionText.trim().length > 0 : true) &&
        (state.contentType === "image" ? state.questionImage.trim().length > 0 : true) &&
        (state.contentType === "text_image"
            ? state.questionText.trim().length > 0 && state.questionImage.trim().length > 0
            : true) &&
        state.correctAnswer.trim().length > 0 &&
        state.options.length >= 2 &&
        state.options.every((o) =>
            o.type === "text"
                ? o.text.trim().length > 0
                : o.type === "image"
                  ? o.imageUrl.trim().length > 0
                  : o.text.trim().length > 0 || o.imageUrl.trim().length > 0
        );

    useEffect(() => {
        onValidityChange?.(valid);
        onChange?.(buildQuestionPayload(state) as QuestionFormValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const patch = (changes: Partial<QuestionFormState>) => setState((prev) => ({ ...prev, ...changes }));

    const addOption = () => {
        if (state.options.length < 6) {
            patch({ options: [...state.options, { type: "text", text: "", imageUrl: "", altText: "" }] });
        }
    };

    const removeOption = (index: number) => {
        if (state.options.length > 2) {
            patch({ options: state.options.filter((_, i) => i !== index) });
        }
    };

    const updateOption = (index: number, field: keyof OptionForm, value: string) => {
        patch({ options: state.options.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)) });
    };

    const { questionType, contentType, questionText, questionImage, explanationText, marks, zamesPoints, correctAnswer, options } =
        state;

    return (
        <div className="space-y-6">
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
                                onValueChange={(v: QuestionType) => patch({ questionType: v, correctAnswer: "" })}
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
                            <Select
                                value={contentType}
                                onValueChange={(v: "text" | "image" | "text_image") => patch({ contentType: v })}
                            >
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

                    {(contentType === "text" || contentType === "text_image") && (
                        <div>
                            <Label>Question Text</Label>
                            <Textarea
                                value={questionText}
                                onChange={(e) => patch({ questionText: e.target.value })}
                                placeholder="Enter the question text"
                                className="min-h-[80px]"
                            />
                        </div>
                    )}

                    {(contentType === "image" || contentType === "text_image") && (
                        <QuestionImageUpload
                            value={questionImage}
                            onChange={(url) => patch({ questionImage: url })}
                            label="Question Image"
                        />
                    )}

                    <div>
                        <Label>Explanation (optional)</Label>
                        <Textarea
                            value={explanationText}
                            onChange={(e) => patch({ explanationText: e.target.value })}
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
                                onChange={(e) => patch({ marks: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Label>Zames Points</Label>
                            <Input
                                type="number"
                                min={0}
                                value={zamesPoints}
                                onChange={(e) => patch({ zamesPoints: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Answer Options</CardTitle>
                    {questionType === "mcq" && options.length < 6 && (
                        <Button variant="outline" size="sm" onClick={addOption}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Label>Correct Answer</Label>
                        <Select value={correctAnswer} onValueChange={(v) => patch({ correctAnswer: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt, index) => (
                                    <SelectItem key={index} value={optionValue(index, opt)}>
                                        {String.fromCharCode(65 + index)}. {opt.text || `(Option ${index + 1})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {options.map((option, index) => (
                        <Card
                            key={index}
                            className={
                                correctAnswer === optionValue(index, option) ? "border-green-500" : undefined
                            }
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="pt-2">
                                        <span
                                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                                                correctAnswer === optionValue(index, option)
                                                    ? "bg-green-500 text-white"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {questionType === "mcq" && (
                                            <Select
                                                value={option.type}
                                                onValueChange={(v: "text" | "image" | "text_image") =>
                                                    updateOption(index, "type", v)
                                                }
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
                                        {(option.type === "text" || option.type === "text_image") && (
                                            <Input
                                                value={option.text}
                                                onChange={(e) => updateOption(index, "text", e.target.value)}
                                                placeholder="Option text"
                                            />
                                        )}
                                        {(option.type === "image" || option.type === "text_image") && (
                                            <QuestionImageUpload
                                                value={option.imageUrl}
                                                onChange={(url) => updateOption(index, "imageUrl", url)}
                                                label={`Option ${String.fromCharCode(65 + index)} Image`}
                                            />
                                        )}
                                    </div>
                                    {questionType === "mcq" && options.length > 2 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
