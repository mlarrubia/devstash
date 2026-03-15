// Mock data for dashboard UI development
// Replace with real Prisma queries once the database is set up

export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "demo@devstash.io",
  image: null,
  isPro: false,
};

export const mockItemTypes = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981", isSystem: true },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899", isSystem: true },
];

export const mockCollections = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    userId: "user_1",
    defaultTypeId: "type_snippet",
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    userId: "user_1",
    defaultTypeId: "type_snippet",
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    userId: "user_1",
    defaultTypeId: "type_file",
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    userId: "user_1",
    defaultTypeId: "type_note",
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    userId: "user_1",
    defaultTypeId: "type_command",
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    userId: "user_1",
    defaultTypeId: "type_prompt",
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthP...')
  }
  return context
}`,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    tags: ["react", "auth", "hooks"],
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    userId: "user_1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(res.statusText)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
    language: "javascript",
    isFavorite: false,
    isPinned: true,
    tags: ["api", "error-handling", "fetch"],
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    userId: "user_1",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "item_3",
    title: "Git Undo Last Commit",
    description: "Undo the last commit while keeping changes staged",
    contentType: "text",
    content: "git reset --soft HEAD~1",
    language: null,
    isFavorite: false,
    isPinned: false,
    tags: ["git", "undo"],
    itemTypeId: "type_command",
    collectionIds: ["col_git"],
    userId: "user_1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "item_4",
    title: "Code Review Prompt",
    description: "Prompt for thorough code reviews",
    contentType: "text",
    content:
      "Review the following code for bugs, security issues, and performance problems. Suggest improvements with explanations.",
    language: null,
    isFavorite: true,
    isPinned: false,
    tags: ["code-review", "ai"],
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai"],
    userId: "user_1",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "item_5",
    title: "Python List Comprehension",
    description: "Common list comprehension patterns",
    contentType: "text",
    content: `# Filter and transform
evens_squared = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [n for row in matrix for n in row]`,
    language: "python",
    isFavorite: false,
    isPinned: false,
    tags: ["python", "list", "comprehension"],
    itemTypeId: "type_snippet",
    collectionIds: ["col_python"],
    userId: "user_1",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];
