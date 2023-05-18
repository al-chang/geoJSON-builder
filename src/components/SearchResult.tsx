import React from "react";
import { fromLonLat } from "ol/proj";
import { SearchResponse } from "../types";
import { dimensionsFromBoundingBox } from "../util";
import { useBuilderContext } from "../contexts/Builder/useBuilderContext";
import { useMapContext } from "../contexts/Map/useMapContext";

type SearchResultProps = {
  result: SearchResponse;
};

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  const { setPreviewGeoJson, setCenter, setZoom } = useMapContext();
  const { addFeature } = useBuilderContext();

  return (
    <div className="m-2 p-2 border-solid border-gray-500 border-2">
      <h3>{result.display_name}</h3>
      <button
        type="button"
        onClick={() => {
          const size = dimensionsFromBoundingBox(
            result.boundingbox.map(parseFloat)
          );
          setPreviewGeoJson(result.geojson);
          // TODO: set zoom based on size
          setZoom(10);
          setCenter(
            fromLonLat([parseFloat(result.lon), parseFloat(result.lat)])
          );
        }}
      >
        Preview
      </button>
      <button
        type="button"
        onClick={() => {
          addFeature(result);
          setPreviewGeoJson(null);
        }}
      >
        Add
      </button>
    </div>
  );
};

export default SearchResult;
