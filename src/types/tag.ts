import { Database } from "./database"

export type Tag = Database["public"]["Tables"]["tags"]["Row"]
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"]
export type TagUpdate = Database["public"]["Tables"]["tags"]["Update"]

export type DocumentTag = Database["public"]["Tables"]["document_tags"]["Row"]

export interface TagWithUsage extends Tag {
  usage_count: number
}
