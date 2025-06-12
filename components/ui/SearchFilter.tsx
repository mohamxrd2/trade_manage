"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 w-full relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  )
}

export default SearchFilter
