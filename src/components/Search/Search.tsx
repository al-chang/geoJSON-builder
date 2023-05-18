import React, { useState } from "react";
import { searchGeoJson } from "../../service/searchService";
import SearchResult from "./SearchResult";
import { SearchResponse } from "../../types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchForm = styled.form`
  width: 100%;
  display: grid;
  grid-template-columns: 70% 30%;
`;

const SearchBar = styled.input`
  margin-right: 10px;
`;

const SearchButton = styled.button`
  margin-right: 10px;
  padding: 10px 0;
`;

const SearchJson: React.FC = () => {
  const [term, setTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResponse[]>([]);

  return (
    <Container>
      <SearchForm
        onSubmit={async (e) => {
          e.preventDefault();
          setSearchResults(await searchGeoJson(term));
        }}
      >
        <SearchBar
          className="text-black"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
      {searchResults.map((result) => (
        <SearchResult key={result.osm_id} result={result} />
      ))}
    </Container>
  );
};

export default SearchJson;
