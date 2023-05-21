import React, { useCallback, useEffect, useRef, useState } from "react";
import { searchGeoJson } from "../../service/searchService";
import SearchResult from "./SearchResult";
import { TSearchResponse } from "../../types";
import styled from "styled-components";
import { debounce } from "../../util";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const SearchForm = styled.form`
  width: 100%;
  position: relative;
`;

const SearchBar = styled.input`
  width: 98%;
`;

const SearchButton = styled.button`
  margin-right: 10px;
  padding: 10px 0;
`;

const SearchResultContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
`;

const SearchJson: React.FC = () => {
  const [term, setTerm] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TSearchResponse[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetDebouncedTerm = useCallback(
    debounce(setDebouncedTerm, 500),
    []
  );

  useEffect(() => {
    const handleFocus = () => {
      setShowResults(document.activeElement === input.current);
    };

    const stopProp = (e: Event) => {
      e.stopPropagation();
    };

    const closeResults = () => {
      setShowResults(false);
    };

    document.addEventListener("focusin", handleFocus);

    const resultsElement = results.current;
    if (resultsElement) {
      resultsElement.addEventListener("click", stopProp);
    }

    const inputElement = input.current;
    if (inputElement) {
      inputElement.addEventListener("click", stopProp);
    }

    document.addEventListener("click", closeResults);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      if (resultsElement) {
        resultsElement.removeEventListener("click", stopProp);
      }
      if (inputElement) {
        inputElement.removeEventListener("click", stopProp);
      }
      document.removeEventListener("click", closeResults);
    };
  }, [results]);

  useEffect(() => {
    const search = async () => {
      const results = await searchGeoJson(debouncedTerm);
      setSearchResults(results);
    };

    if (debouncedTerm) {
      search();
    }
  }, [debouncedTerm]);

  return (
    <Container>
      <SearchBar
        className="text-black"
        value={term}
        ref={input}
        onChange={(e) => {
          setTerm(e.target.value);
          debounceSetDebouncedTerm(e.target.value);
        }}
      />
      {showResults && (
        <SearchResultContainer ref={results}>
          {searchResults.map((result) => (
            <SearchResult key={result.osm_id} result={result} />
          ))}
        </SearchResultContainer>
      )}
    </Container>
  );
};

export default SearchJson;
