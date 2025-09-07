import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableInputProps {
  placeholder: string;
  suggestions: string[];
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const SearchableInput = ({ 
  placeholder, 
  suggestions, 
  value = "", 
  onChange,
  id 
}: SearchableInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Sync internal state with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange?.(selectedValue);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange?.(newValue);
    // Only show suggestions if user has typed at least 2 characters
    setOpen(newValue.length > 1 && filteredSuggestions.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click on suggestions
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setOpen(inputValue.length > 1 && filteredSuggestions.length > 0)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          {filteredSuggestions.length > 0 && inputValue.length > 1 && (
            <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
        </div>
      </PopoverTrigger>
      {filteredSuggestions.length > 0 && inputValue.length > 1 && (
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No suggestions found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    // Focus back on input to allow easy editing
                    document.getElementById(id || '')?.focus();
                  }}
                  className="text-muted-foreground"
                >
                  ✕ Close suggestions
                </CommandItem>
                {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        inputValue === suggestion ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};