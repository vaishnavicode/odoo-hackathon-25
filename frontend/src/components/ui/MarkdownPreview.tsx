import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownPreviewProps {
    children: string;
    className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
    children,
    className = "",
}) => {
    const components = {
        // Code blocks with syntax highlighting
        code({
            node,
            inline,
            className,
            children,
            ...props
        }: {
            node?: unknown;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <div className="my-4 rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="!bg-gray-900 !p-4 !m-0 text-sm"
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code
                    className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-orange-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700"
                    {...props}
                >
                    {children}
                </code>
            );
        },

        // Custom link styling
        a({
            href,
            children,
            ...props
        }: {
            href?: string;
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
                    {...props}
                >
                    {children}
                </a>
            );
        },

        // Custom blockquote styling
        blockquote({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <blockquote
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r-md"
                    {...props}
                >
                    {children}
                </blockquote>
            );
        },

        // Custom table styling
        table({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <div className="overflow-x-auto my-4">
                    <table
                        className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        {...props}
                    >
                        {children}
                    </table>
                </div>
            );
        },

        // Table header styling
        th({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <th
                    className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    {...props}
                >
                    {children}
                </th>
            );
        },

        // Table data styling
        td({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <td
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    {...props}
                >
                    {children}
                </td>
            );
        },

        // Table row hover effect
        tr({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    {...props}
                >
                    {children}
                </tr>
            );
        },

        // Custom heading styling
        h1({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h1
                    className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
                    {...props}
                >
                    {children}
                </h1>
            );
        },

        h2({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h2
                    className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700"
                    {...props}
                >
                    {children}
                </h2>
            );
        },

        h3({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h3
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3"
                    {...props}
                >
                    {children}
                </h3>
            );
        },

        h4({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h4
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2"
                    {...props}
                >
                    {children}
                </h4>
            );
        },

        h5({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h5
                    className="text-base font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2"
                    {...props}
                >
                    {children}
                </h5>
            );
        },

        h6({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <h6
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-4 mb-2"
                    {...props}
                >
                    {children}
                </h6>
            );
        },

        // Custom list styling
        ul({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <ul
                    className="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300 ml-4"
                    {...props}
                >
                    {children}
                </ul>
            );
        },

        ol({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <ol
                    className="list-decimal list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300 ml-4"
                    {...props}
                >
                    {children}
                </ol>
            );
        },

        // List item styling
        li({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <li className="leading-relaxed" {...props}>
                    {children}
                </li>
            );
        },

        // Custom paragraph styling
        p({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <p
                    className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
                    {...props}
                >
                    {children}
                </p>
            );
        },

        // Horizontal rule styling
        hr({ ...props }: { [key: string]: unknown }) {
            return (
                <hr
                    className="my-8 border-t-2 border-gray-200 dark:border-gray-700"
                    {...props}
                />
            );
        },

        // Image styling
        img({
            src,
            alt,
            ...props
        }: {
            src?: string;
            alt?: string;
            [key: string]: unknown;
        }) {
            return (
                <img
                    src={src}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg shadow-md my-4"
                    {...props}
                />
            );
        },

        // Strong text styling
        strong({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <strong
                    className="font-semibold text-gray-900 dark:text-gray-100"
                    {...props}
                >
                    {children}
                </strong>
            );
        },

        // Emphasis styling
        em({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <em
                    className="italic text-gray-700 dark:text-gray-300"
                    {...props}
                >
                    {children}
                </em>
            );
        },

        // Strikethrough styling
        del({
            children,
            ...props
        }: {
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            return (
                <del
                    className="line-through text-gray-500 dark:text-gray-400"
                    {...props}
                >
                    {children}
                </del>
            );
        },
    };

    return (
        <div
            className={`
      font-sans text-base 
      max-w-full 
      prose prose-gray dark:prose-invert 
      prose-headings:text-gray-900 dark:prose-headings:text-gray-100
      prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-a:text-blue-600 dark:prose-a:text-blue-400
      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
      prose-code:text-red-600 dark:prose-code:text-orange-400
      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
      prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
      prose-th:text-gray-900 dark:prose-th:text-gray-100
      prose-td:text-gray-700 dark:prose-td:text-gray-300
      ${className}
    `}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                components={components as any}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownPreview;
