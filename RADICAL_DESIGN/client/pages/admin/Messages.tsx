import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Trash2,
  Search,
  Filter,
  Mail,
  CheckCircle,
  Circle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  read: boolean;
  date: string;
}

type FilterStatus = "all" | "unread" | "read";

export default function AdminMessages() {
  const { sessionId } = useAdmin();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/messages", {
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search messages
  const applyFilters = (
    msgs: Message[],
    query: string,
    status: FilterStatus
  ) => {
    let filtered = msgs;

    // Apply status filter
    if (status === "unread") {
      filtered = filtered.filter((m) => !m.read);
    } else if (status === "read") {
      filtered = filtered.filter((m) => m.read);
    }

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.email.toLowerCase().includes(lowerQuery) ||
          m.subject.toLowerCase().includes(lowerQuery) ||
          m.message.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  };

  // Update filtered messages when messages, search, or filter changes
  useEffect(() => {
    setFilteredMessages(applyFilters(messages, searchQuery, filterStatus));
  }, [messages, searchQuery, filterStatus]);

  // Mark message as read/unread
  const handleToggleRead = async (message: Message) => {
    try {
      const response = await fetch(`/api/admin/messages/${message.id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": sessionId || "",
        },
        body: JSON.stringify({ read: !message.read }),
      });

      if (response.ok) {
        const updatedMessages = messages.map((m) =>
          m.id === message.id ? { ...m, read: !m.read } : m
        );
        setMessages(updatedMessages);
        if (selectedMessage?.id === message.id) {
          setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read });
        }
        toast({
          title: "Success",
          description: `Message marked as ${!message.read ? "read" : "unread"}`,
        });
      }
    } catch (error) {
      console.error("Failed to update message:", error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  // Delete message
  const handleDelete = async (message: Message) => {
    try {
      setDeleting(message.id);
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-session": sessionId || "",
        },
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== message.id));
        setShowDetails(false);
        setSelectedMessage(null);
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    }
  }, [sessionId]);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Contact Messages
            </h1>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {unreadCount > 0 && (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  {unreadCount} Unread
                </span>
              )}
              {unreadCount === 0 && (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All Read
                </span>
              )}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage contact form submissions from your website
          </p>
        </div>

        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="gap-2 text-xs sm:text-sm"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">All</span>
              <span className="sm:hidden">All</span>
            </Button>
            <Button
              variant={filterStatus === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("unread")}
              className="gap-2 text-xs sm:text-sm"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Unread</span>
              <span className="sm:hidden">(0)</span>
            </Button>
            <Button
              variant={filterStatus === "read" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("read")}
              className="gap-2 text-xs sm:text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Read</span>
            </Button>
          </div>
        </div>

        {/* Messages Table */}
        <div className="border rounded-lg overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  {messages.length === 0
                    ? "No messages yet"
                    : "No messages matching your search"}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[80px]">Date</TableHead>
                    <TableHead className="min-w-[100px]">Name</TableHead>
                    <TableHead className="min-w-[150px]">Email</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[150px]">Subject</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={`hover:bg-muted/50 transition-colors ${
                        !message.read ? "bg-amber-50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <TableCell className="text-center">
                        {!message.read ? (
                          <Circle className="w-3 h-3 fill-amber-500 text-amber-500 mx-auto" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(message.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-medium text-sm line-clamp-1">{message.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                        {message.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm line-clamp-1">
                        {message.subject}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowDetails(true);
                            }}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRead(message)}
                            title={
                              message.read
                                ? "Mark as unread"
                                : "Mark as read"
                            }
                          >
                            {message.read ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-amber-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(message)}
                            disabled={deleting === message.id}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredMessages.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        )}
      </div>

      {/* Message Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-xl">
                      {selectedMessage.subject}
                    </DialogTitle>
                    <div className="space-y-1 mt-4 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          From:
                        </span>{" "}
                        {selectedMessage.name}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Email:
                        </span>{" "}
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </p>
                      {selectedMessage.phone && (
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Phone:
                          </span>{" "}
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="text-primary hover:underline"
                          >
                            {selectedMessage.phone}
                          </a>
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Date:
                        </span>{" "}
                        {new Date(
                          selectedMessage.date
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!selectedMessage.read && (
                    <Badge className="bg-amber-500">Unread</Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="my-6 pt-6 border-t">
                <h3 className="font-semibold mb-3 text-foreground">Message</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <DialogFooter className="flex gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="gap-2 flex-1"
                >
                  {selectedMessage.read ? (
                    <>
                      <Mail className="w-4 h-4" />
                      Mark as Unread
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Mark as Read
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedMessage);
                  }}
                  disabled={deleting === selectedMessage.id}
                  className="gap-2 flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Message
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
