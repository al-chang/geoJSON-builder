import React, { useState } from "react";
import { searchGeoJson } from "../service/searchService";
import SearchResult from "./SearchResult";
import { SearchResponse } from "../types";

const SearchJson: React.FC = () => {
  const [term, setTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResponse[]>([]);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSearchResults(await searchGeoJson(term));
        }}
      >
        <input
          className="text-black"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {searchResults.map((result) => (
        <SearchResult key={result.osm_id} result={result} />
      ))}
    </div>
  );
};

export default SearchJson;
