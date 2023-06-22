import React, { useCallback, useEffect, useState } from "react";
import { searchGeoJson } from "../../service/searchService";
import SearchResult from "./SearchResult";
import { TSearchResponse } from "../../types";
import styled from "styled-components";
import { debounce } from "../../util";
import { useMapContext } from "../../contexts/Map/useMapContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 15px;
`;

const SearchBar = styled.input`
  width: 85%;
  border-radius: 15px;
  background-color: #fff;
  color: black;
  height: 25px;
  margin: 10px auto;
  padding: 0 2%;

  &:focus {
    outline: none;
  }
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

  const { setPreviewGeoJson } = useMapContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetDebouncedTerm = useCallback(
    debounce(setDebouncedTerm, 500),
    []
  );

  useEffect(() => {
    const closeResults = () => {
      setShowResults(false);
    };
    const closeResultsOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResults(false);
      }
    };

    document.addEventListener("click", closeResults);
    document.addEventListener("keydown", closeResultsOnEscape);

    return () => {
      document.removeEventListener("click", closeResults);
      document.removeEventListener("keydown", closeResultsOnEscape);
    };
  }, []);

  useEffect(() => {
    const search = async () => {
      const results = await searchGeoJson(debouncedTerm);
      setSearchResults(results);
    };

    if (debouncedTerm === "") {
      setSearchResults([]);
    } else if (debouncedTerm) {
      search();
    }

    setPreviewGeoJson(null);
  }, [debouncedTerm, setPreviewGeoJson]);

  return (
    <Container>
      <SearchBar
        className="text-black"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setShowResults(true);
          debounceSetDebouncedTerm(e.target.value);
        }}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
        }}
        onFocus={() => {
          setShowResults(true);
        }}
      />

      <SearchResultContainer
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {showResults
          ? searchResults.map((result) => (
              <SearchResult key={result.osm_id} result={result} />
            ))
          : null}
      </SearchResultContainer>
    </Container>
  );
};

export default SearchJson;
