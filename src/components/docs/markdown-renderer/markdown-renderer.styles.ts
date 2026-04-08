export const markdownRendererStyles = {
  headings: {
    h1: "text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 scroll-mt-20",
    h2: "text-2xl font-semibold text-gray-900 mb-4 mt-6 scroll-mt-20",
    h3: "text-xl font-semibold text-gray-900 mb-3 mt-5 scroll-mt-20",
    h4: "text-lg font-semibold text-gray-900 mb-2 mt-4 scroll-mt-20",
    h5: "text-base font-semibold text-gray-900 mb-2 mt-3 scroll-mt-20",
    h6: "text-sm font-semibold text-gray-900 mb-2 mt-3 scroll-mt-20"
  },
  text: {
    paragraph: "text-gray-700 mb-4 leading-relaxed",
    strong: "font-semibold text-gray-900",
    emphasis: "italic text-gray-700"
  },
  code: {
    inline: "bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono",
    block: "bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"
  },
  lists: {
    unordered: "list-disc list-inside mb-4 text-gray-700 space-y-1 ml-4",
    ordered: "list-decimal list-inside mb-4 text-gray-700 space-y-1 ml-4",
    item: "text-gray-700"
  },
  blockquote: "border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4 bg-blue-50 py-2 rounded-r",
  link: "text-blue-600 hover:text-blue-800 underline",
  table: {
    container: "overflow-x-auto mb-4",
    table: "min-w-full border border-gray-300",
    thead: "bg-gray-50",
    tbody: "",
    tr: "border-b border-gray-200",
    th: "px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0",
    td: "px-4 py-2 text-gray-700 border-r border-gray-300 last:border-r-0"
  },
  hr: "border-gray-300 my-6"
}