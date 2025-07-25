"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Clock, BookOpen, Brain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'flashcard' | 'deck';
  title: string;
  content: string;
  deckName?: string;
  deckId?: string;
  difficulty?: string;
  lastReviewed?: string;
  createdAt: string;
}

interface SearchFilters {
  type: string[];
  difficulty: string[];
  dateRange: string;
  studyStatus: string[];
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: ['flashcard', 'deck'],
    difficulty: [],
    dateRange: 'all',
    studyStatus: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters })
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ FIXED: Perform search when query changes - Added performSearch dependency
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [debouncedSearchQuery, filters, performSearch]); // ✅ ADDED: performSearch

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;

    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    performSearch(query);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'deck') {
      router.push(`/flashcards/${result.id}`);
    } else {
      router.push(`/flashcards/${result.deckId}`);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search flashcards and decks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
          className="pl-10 pr-20"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Search Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs text-muted-foreground">Content Type</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.type.includes('flashcard')}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    type: checked 
                      ? [...prev.type, 'flashcard']
                      : prev.type.filter(t => t !== 'flashcard')
                  }));
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Flashcards
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.type.includes('deck')}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    type: checked 
                      ? [...prev.type, 'deck']
                      : prev.type.filter(t => t !== 'deck')
                  }));
                }}
              >
                <Brain className="h-4 w-4 mr-2" />
                Decks
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Difficulty</DropdownMenuLabel>
              {['EASY', 'MEDIUM', 'HARD'].map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={filters.difficulty.includes(difficulty)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      difficulty: checked 
                        ? [...prev.difficulty, difficulty]
                        : prev.difficulty.filter(d => d !== difficulty)
                    }));
                  }}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Button */}
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {result.type === 'deck' ? (
                            <Brain className="h-4 w-4 text-purple-600" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.difficulty && (
                            <Badge 
                              variant={
                                result.difficulty === 'EASY' ? 'default' : 
                                result.difficulty === 'MEDIUM' ? 'secondary' : 
                                'destructive'
                              }
                              className="text-xs"
                            >
                              {result.difficulty}
                            </Badge>
                          )}
                        </div>
                        <h4 
                          className="font-medium text-sm mb-1"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.title, searchQuery)
                          }}
                        />
                        <p 
                          className="text-xs text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.content, searchQuery)
                          }}
                        />
                        {result.deckName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            in {result.deckName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-4 text-center">
                {/* ✅ FIXED: Escaped quotes properly */}
                <p className="text-sm text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearchSubmit(search);
                    }}
                  >
                    {search}
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
