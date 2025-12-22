import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Bell, Plus, Pencil, Trash2, PartyPopper, Utensils, IndianRupee, AlertCircle, Calendar } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  description: string;
  type: "event" | "mess" | "billing" | "important" | "general";
  date: string;
  isNew: boolean;
}

const typeConfig = {
  event: { icon: PartyPopper, color: "bg-purple-500/10 text-purple-600 border-purple-500/20", label: "Event" },
  mess: { icon: Utensils, color: "bg-orange-500/10 text-orange-600 border-orange-500/20", label: "Mess" },
  billing: { icon: IndianRupee, color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Billing" },
  important: { icon: AlertCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Important" },
  general: { icon: Bell, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "General" },
};

const initialNotices: Notice[] = [
  {
    id: "1",
    title: "Hostel Annual Day Celebration",
    description: "Join us for the annual hostel day celebration on Dec 28th with cultural programs, games, and dinner.",
    type: "event",
    date: "Dec 20, 2024",
    isNew: true,
  },
  {
    id: "2",
    title: "December Mess Bill Due",
    description: "Mess bill for December is ₹4,500. Last date to pay: Dec 25, 2024. Pay at hostel office or online.",
    type: "billing",
    date: "Dec 18, 2024",
    isNew: true,
  },
  {
    id: "3",
    title: "Mess Menu Updated",
    description: "New mess menu effective from Dec 20th. Special items added for weekends.",
    type: "mess",
    date: "Dec 17, 2024",
    isNew: false,
  },
  {
    id: "4",
    title: "Winter Vacation Notice",
    description: "Hostel will remain closed from Dec 24 to Jan 2. Students must vacate rooms by Dec 23, 6 PM.",
    type: "important",
    date: "Dec 15, 2024",
    isNew: false,
  },
];

export function AdminNoticeManager() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "general" as Notice["type"],
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", type: "general" });
    setEditingNotice(null);
  };

  const handleOpenDialog = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        description: notice.description,
        type: notice.type,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (editingNotice) {
      setNotices(
        notices.map((n) =>
          n.id === editingNotice.id
            ? { ...n, ...formData }
            : n
        )
      );
      toast({
        title: "Notice Updated",
        description: "The notice has been updated successfully.",
      });
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: currentDate,
        isNew: true,
      };
      setNotices([newNotice, ...notices]);
      toast({
        title: "Notice Created",
        description: "New notice has been published successfully.",
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
    toast({
      title: "Notice Deleted",
      description: "The notice has been removed.",
    });
  };

  const toggleNewStatus = (id: string) => {
    setNotices(
      notices.map((n) =>
        n.id === id ? { ...n, isNew: !n.isNew } : n
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notice Board Management
            </CardTitle>
            <CardDescription>
              Create and manage notices for students
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4" />
                Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? "Edit Notice" : "Create New Notice"}
                </DialogTitle>
                <DialogDescription>
                  {editingNotice
                    ? "Update the notice details below"
                    : "Fill in the details to publish a new notice"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notice title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Notice["type"]) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">🎉 Event</SelectItem>
                      <SelectItem value="mess">🍽️ Mess</SelectItem>
                      <SelectItem value="billing">💰 Billing</SelectItem>
                      <SelectItem value="important">⚠️ Important</SelectItem>
                      <SelectItem value="general">📢 General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter notice details..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNotice ? "Update Notice" : "Publish Notice"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No notices yet. Create your first notice!
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice) => {
                  const config = typeConfig[notice.type];
                  return (
                    <TableRow key={notice.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {notice.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {notice.date}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNewStatus(notice.id)}
                          className={notice.isNew ? "text-primary" : "text-muted-foreground"}
                        >
                          {notice.isNew ? (
                            <Badge className="bg-primary/10 text-primary">New</Badge>
                          ) : (
                            <Badge variant="secondary">Read</Badge>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(notice)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notice.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
