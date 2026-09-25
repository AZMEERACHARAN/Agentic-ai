"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import type { Country, CountrySearchProps } from "./types";
import { searchCountries } from "@/lib/countries/country-data";

export const CountrySearch: React.FC<CountrySearchProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter matching countries based on query
  const searchResults = useMemo(() => {
    return searchCountries(query, countries, 8);
  }, [query, countries]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelect(searchResults[highlightedIndex]);
      } else if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (country: Country) => {
    onSelectCountry(country);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      id="country-search-container"
      className="relative w-full max-w-md pointer-events-auto"
      style={{ zIndex: 40 }}
    >
      {/* Search Input Box */}
      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isOpen
            ? "1px solid rgba(16, 185, 129, 0.5)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isOpen
            ? "0 0 20px rgba(16, 185, 129, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Search Icon */}
        <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-emerald-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          id="country-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search country (e.g. India, USA, Japan)..."
          className="w-full py-2.5 pr-10 text-sm text-gray-100 placeholder-gray-400 bg-transparent outline-none focus:ring-0"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search country"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-200 transition-colors rounded-full"
            aria-label="Clear search"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && query.trim().length > 0 && (
        <div
          id="country-search-dropdown"
          className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl transition-all duration-150 animate-in fade-in slide-in-from-top-1"
          style={{
            background: "rgba(13, 17, 23, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {searchResults.length > 0 ? (
            <ul className="py-1 divide-y divide-white/5" role="listbox">
              {searchResults.map((country, index) => {
                const isSelected = selectedCountry?.iso3 === country.iso3;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={`${country.iso3}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150"
                    style={{
                      backgroundColor: isHighlighted
                        ? "rgba(16, 185, 129, 0.15)"
                        : isSelected
                        ? "rgba(16, 185, 129, 0.08)"
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none">🌐</span>
                      <span
                        className={`truncate font-medium ${
                          isHighlighted ? "text-emerald-300" : "text-gray-100"
                        }`}
                      >
                        {country.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {country.iso2 && (
                        <span className="text-xs text-gray-500 font-mono">
                          {country.iso2}
                        </span>
                      )}
                      <span
                        className="text-xs px-2 py-0.5 rounded font-mono font-semibold"
                        style={{
                          background: isSelected
                            ? "rgba(16, 185, 129, 0.25)"
                            : "rgba(255, 255, 255, 0.07)",
                          color: isSelected ? "#34d399" : "#9ca3af",
                          border: isSelected
                            ? "1px solid rgba(16, 185, 129, 0.4)"
                            : "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        {country.iso3}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              <p>No matching countries found</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching by full name or 3-letter ISO code
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
