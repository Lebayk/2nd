import { useMemo } from 'react'
import katex from 'katex'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode, output: 'htmlAndMathml' })
  } catch {
    return escapeHtml(latex)
  }
}

/**
 * Parse a string mixing plain text, `$...$` inline math, `$$...$$` display math
 * and `` `code` `` spans into safe HTML.
 */
function parse(text: string): string {
  const tokens = text.split(/(\$\$[^$]*\$\$|\$[^$]*\$|`[^`]*`)/g)
  return tokens
    .map((tok) => {
      if (!tok) return ''
      if (tok.startsWith('$$') && tok.endsWith('$$')) return renderMath(tok.slice(2, -2), true)
      if (tok.startsWith('$') && tok.endsWith('$')) return renderMath(tok.slice(1, -1), false)
      if (tok.startsWith('`') && tok.endsWith('`'))
        return `<code class="font-mono text-[0.86em] px-1.5 py-0.5 rounded-md bg-ink-3 text-gold-2 border border-white/10">${escapeHtml(
          tok.slice(1, -1),
        )}</code>`
      return escapeHtml(tok)
    })
    .join('')
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => parse(text), [text])
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
