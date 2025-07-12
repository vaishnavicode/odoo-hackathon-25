import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface MentionUser {
    id: string;
    username: string;
}

interface MentionTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    users?: MentionUser[]; // For mention suggestions
}

const MentionTextarea = ({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    users = [],
}: MentionTextareaProps) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<MentionUser[]>([]);
    const [mentionQuery, setMentionQuery] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Handle text change and detect @ mentions
    const handleTextChange = (newValue: string) => {
        onChange(newValue);

        const textarea = textareaRef.current;
        if (!textarea) return;

        const position = textarea.selectionStart;
        setCursorPosition(position);

        // Find @ symbol before cursor
        const textBeforeCursor = newValue.substring(0, position);
        const lastAtIndex = textBeforeCursor.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

            // Check if there's a space after @ (which would end the mention)
            if (!textAfterAt.includes(" ") && textAfterAt.length >= 0) {
                setMentionQuery(textAfterAt);
                setShowSuggestions(true);

                // Filter users based on query
                const filtered = users
                    .filter((user) =>
                        user.username
                            .toLowerCase()
                            .includes(textAfterAt.toLowerCase())
                    )
                    .slice(0, 5); // Limit to 5 suggestions

                setFilteredUsers(filtered);
                setSelectedSuggestion(0);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    // Handle mention selection
    const selectMention = (user: MentionUser) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const textBeforeCursor = value.substring(0, cursorPosition);
        const textAfterCursor = value.substring(cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            const beforeAt = value.substring(0, lastAtIndex);
            const newValue = beforeAt + `@${user.username} ` + textAfterCursor;
            onChange(newValue);

            // Set cursor position after the mention
            setTimeout(() => {
                const newPosition = lastAtIndex + user.username.length + 2;
                textarea.setSelectionRange(newPosition, newPosition);
                textarea.focus();
            }, 0);
        }

        setShowSuggestions(false);
    };

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || filteredUsers.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedSuggestion((prev) =>
                prev < filteredUsers.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedSuggestion((prev) =>
                prev > 0 ? prev - 1 : filteredUsers.length - 1
            );
        } else if (e.key === "Enter" && showSuggestions) {
            e.preventDefault();
            selectMention(filteredUsers[selectedSuggestion]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionRef.current &&
                !suggestionRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
            />

            {showSuggestions && filteredUsers.length > 0 && (
                <Card
                    ref={suggestionRef}
                    className="absolute z-50 mt-1 w-64 border shadow-lg"
                >
                    <CardContent className="p-0">
                        <div className="max-h-40 overflow-y-auto">
                            {filteredUsers.map((user, index) => (
                                <Button
                                    key={user.id}
                                    variant="ghost"
                                    className={`w-full justify-start px-3 py-2 h-auto ${
                                        index === selectedSuggestion
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                    onClick={() => selectMention(user)}
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    <span className="font-medium">
                                        @{user.username}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MentionTextarea;
