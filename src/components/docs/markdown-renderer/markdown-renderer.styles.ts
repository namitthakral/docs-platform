export const markdownRendererStyles = {
  headings: {
    h1: "text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0 scroll-mt-20",
    h2: "text-2xl font-semibold text-foreground mb-4 mt-6 scroll-mt-20",
    h3: "text-xl font-semibold text-foreground mb-3 mt-5 scroll-mt-20",
    h4: "text-lg font-semibold text-foreground mb-2 mt-4 scroll-mt-20",
    h5: "text-base font-semibold text-foreground mb-2 mt-3 scroll-mt-20",
    h6: "text-sm font-semibold text-foreground mb-2 mt-3 scroll-mt-20"
  },
  text: {
    paragraph: "text-foreground/80 mb-4 leading-relaxed",
    strong: "font-semibold text-foreground",
    emphasis: "italic text-foreground/80"
  },
  code: {
    inline: "bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono",
    block: "bg-muted text-foreground p-4 rounded-lg mb-4 overflow-x-auto border border-border"
  },
  lists: {
    unordered: "list-disc list-inside mb-4 text-foreground/80 space-y-1 ml-4",
    ordered: "list-decimal list-inside mb-4 text-foreground/80 space-y-1 ml-4",
    item: "text-foreground/80"
  },
  blockquote: "border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 bg-primary/5 py-2 rounded-r",
  link: "text-primary hover:text-primary/80 underline",
  table: {
    container: "overflow-x-auto mb-4",
    table: "min-w-full border border-border",
    thead: "bg-muted",
    tbody: "",
    tr: "border-b border-border",
    th: "px-4 py-2 text-left font-semibold text-foreground border-r border-border last:border-r-0",
    td: "px-4 py-2 text-foreground/80 border-r border-border last:border-r-0"
  },
  hr: "border-border my-6"
}