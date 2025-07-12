import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import TurndownService from "turndown";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
} from "lucide-react";

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function RichEditor({
    value,
    onChange,
    placeholder = "Start writing...",
    className,
    disabled = false,
}: RichEditorProps) {
    // Initialize turndown service for HTML to Markdown conversion
    const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 hover:text-blue-800 underline",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const markdown = turndownService.turndown(html);
            onChange(markdown);
        },
        editable: !disabled,
    });

    const setLink = () => {
        if (!editor) return;

        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={cn("border border-gray-300 rounded-md", className)}>
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("bold") && "bg-gray-100"
                    )}
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can().chain().focus().toggleItalic().run()
                    }
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("italic") && "bg-gray-100"
                    )}
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can().chain().focus().toggleStrike().run()
                    }
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("strike") && "bg-gray-100"
                    )}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("code") && "bg-gray-100"
                    )}
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("bulletList") && "bg-gray-100"
                    )}
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("orderedList") && "bg-gray-100"
                    )}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("blockquote") && "bg-gray-100"
                    )}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={cn(
                        "h-8 w-8 p-0",
                        editor.isActive("link") && "bg-gray-100"
                    )}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive("link")}
                    className="h-8 w-8 p-0"
                >
                    <Unlink className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="p-3 min-h-[100px]">
                <EditorContent
                    editor={editor}
                    className={cn(
                        "prose prose-sm max-w-none focus:outline-none",
                        "[&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[80px]",
                        "[&_.ProseMirror]:border-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:shadow-none",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                />
            </div>
        </div>
    );
}
