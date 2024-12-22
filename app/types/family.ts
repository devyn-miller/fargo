export interface FamilyMemberType {
  id: string
  name: string
  birthdate?: string
  bio?: string
  parentId?: string
  relationships?: { [key: string]: string }
  milestones?: { date: string, description: string }[]
}

