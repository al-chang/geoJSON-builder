import React, { useCallback, useEffect, useState } from "react";
import { searchGeoJson } from "../../service/searchService";
import SearchResult from "./SearchResult";
import { TSearchResponse } from "../../types";
import styled from "styled-components";
import { debounce } from "../../util";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchForm = styled.form`
  width: 100%;
  display: grid;
  grid-template-columns: 70% 30%;
  position: relative;
`;

const SearchBar = styled.input`
  margin-right: 10px;
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

  const debounceSetDebouncedTerm = useCallback(
    debounce(setDebouncedTerm, 500),
    []
  );

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
      <SearchForm>
        <SearchBar
          className="text-black"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            debounceSetDebouncedTerm(e.target.value);
          }}
        />
        {debouncedTerm}
        <SearchResultContainer>
          {searchResults.map((result) => (
            <SearchResult key={result.osm_id} result={result} />
          ))}
        </SearchResultContainer>
      </SearchForm>
    </Container>
  );
};

export default SearchJson;
