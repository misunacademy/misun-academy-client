"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import {
    useGetMotivationalMessagesQuery,
    useCreateMotivationalMessageMutation,
    useUpdateMotivationalMessageMutation,
    useDeleteMotivationalMessageMutation,
} from "@/redux/api/gamificationApi";
import { IMotivationalMessage } from "@/types/quiz";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function GamificationSettings() {
    const { data, isLoading } = useGetMotivationalMessagesQuery();
    const messages = data?.data || [];
    const [createMessage] = useCreateMotivationalMessageMutation();
    const [updateMessage] = useUpdateMotivationalMessageMutation();
    const [deleteMessage] = useDeleteMotivationalMessageMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState<IMotivationalMessage | null>(null);
    const [form, setForm] = useState({
        minPercentage: 0,
        maxPercentage: 100,
        title: "",
        message: "",
        emoji: "",
        isActive: true,
    });

    const resetForm = () => {
        setForm({ minPercentage: 0, maxPercentage: 100, title: "", message: "", emoji: "", isActive: true });
        setEditingMessage(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (msg: IMotivationalMessage) => {
        setEditingMessage(msg);
        setForm({
            minPercentage: msg.minPercentage,
            maxPercentage: msg.maxPercentage,
            title: msg.title,
            message: msg.message,
            emoji: msg.emoji || "",
            isActive: msg.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingMessage) {
                await updateMessage({ messageId: editingMessage._id, data: form }).unwrap();
                toast.success("Message updated successfully");
            } else {
                await createMessage(form).unwrap();
                toast.success("Message created successfully");
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to save message");
        }
    };

    const handleDelete = async (messageId: string) => {
        try {
            await deleteMessage(messageId).unwrap();
            toast.success("Message deleted successfully");
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to delete message");
        }
    };

    return (
        <>
            <DashboardPageContainer
                heading="Gamification Settings"
                subheading="Configure motivational messages, Zames rules, and leaderboard settings"
                buttons={
                    <Button onClick={handleOpenCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Message
                    </Button>
                }
                content={
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Motivational Messages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <Card key={msg._id} className="border-l-4 border-l-primary">
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{msg.emoji}</span>
                                                        <span className="font-semibold">{msg.title}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            ({msg.minPercentage}% - {msg.maxPercentage}%)
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(msg)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(msg._id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {messages.length === 0 && !isLoading && (
                                        <p className="text-center text-muted-foreground py-8">
                                            No motivational messages configured yet.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Zames Rules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Enable Gamification</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Award Zames points for quiz completions
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Zames points are awarded based on correct answers.
                                        Each question has a configurable Zames value (default: 1 point per question).
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                }
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMessage ? "Edit Motivational Message" : "Add Motivational Message"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Min %</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.minPercentage}
                                    onChange={(e) => setForm({ ...form, minPercentage: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label>Max %</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.maxPercentage}
                                    onChange={(e) => setForm({ ...form, maxPercentage: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g., Outstanding!"
                            />
                        </div>
                        <div>
                            <Label>Message</Label>
                            <Input
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="You're mastering this topic!"
                            />
                        </div>
                        <div>
                            <Label>Emoji</Label>
                            <Input
                                value={form.emoji}
                                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                placeholder="🎉"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Active</Label>
                            <Switch
                                checked={form.isActive}
                                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                            />
                        </div>
                        <Button onClick={handleSave} className="w-full">
                            {editingMessage ? "Update" : "Add"} Message
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
