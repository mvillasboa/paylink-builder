import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "text", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="bg-muted px-4 py-2 text-xs font-mono text-muted-foreground border border-border rounded-t-lg">
          {filename}
        </div>
      )}
      <div className={`relative bg-muted/30 border border-border ${filename ? 'rounded-b-lg border-t-0' : 'rounded-lg'}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
          <code className={`language-${language} font-mono`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
