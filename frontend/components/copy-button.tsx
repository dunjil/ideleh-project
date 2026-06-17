"use client"

import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyButtonProps {
  text: string
  title?: string
  className?: string
}

export function CopyButton({ text, title = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={className}
      title={copied ? "Copied!" : title}
    >
      <Copy className="h-4 w-4" />
      {copied && <span className="ml-1 text-xs">✓</span>}
    </button>
  )
}
