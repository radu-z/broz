import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export interface MarkdownData {
  title: string
  slug: string
  content: string
  excerpt?: string
  date?: string
  [key: string]: any
}

const contentDirectory = path.join(process.cwd(), 'content')

export function getMarkdownFiles(dir: string = contentDirectory, lang?: string): string[] {
  const searchDir = lang ? path.join(dir, lang) : dir
  
  const files: string[] = []
  
  if (!fs.existsSync(searchDir)) return files
  
  const items = fs.readdirSync(searchDir)
  
  for (const item of items) {
    const fullPath = path.join(searchDir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath, undefined))
    } else if (item.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  
  return files
}

export function readMarkdownFile(filePath: string, lang?: string): MarkdownData | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    let relativePath = path.relative(contentDirectory, filePath)
    // Normalize to forward slashes for Windows compatibility
    relativePath = relativePath.replace(/\\/g, '/')
    
    // If reading from a language subdirectory, strip the lang prefix from slug
    if (lang) {
      const langPrefix = `${lang}/`
      if (relativePath.startsWith(langPrefix)) {
        relativePath = relativePath.slice(langPrefix.length)
      }
    }
    
    const slug = relativePath.replace(/\.md$/, '')
    
    return {
      ...data,
      slug,
      content,
    } as MarkdownData
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return null
  }
}

export async function getAllMarkdown(lang?: string): Promise<MarkdownData[]> {
  const files = getMarkdownFiles(contentDirectory, lang)
  const markdownData = files
    .map(file => readMarkdownFile(file, lang))
    .filter((data): data is MarkdownData => data !== null)
  
  return markdownData.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })
}

export async function getMarkdownBySlug(slug: string, lang?: string): Promise<MarkdownData | null> {
  const allData = await getAllMarkdown(lang)
  return allData.find(data => data.slug === slug) || null
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return String(result)
}

export function getPageBySlug(slug: string): string {
  const normalizedSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug
  return normalizedSlug.split('/').pop() || 'index'
}