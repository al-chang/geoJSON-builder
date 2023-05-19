import React from "react";
import { fromLonLat } from "ol/proj";
import { TSearchResponse } from "../../types";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { dimensionsFromBoundingBox } from "../../util";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid white;
  margin: 5px;
`;

const DisplayName = styled.h3`
  margin: 5px;
  padding: 0;
  font-size: normal;
  font-weight: normal;
`;

type SearchResultProps = {
  result: TSearchResponse;
};

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  const { setPreviewGeoJson, setCenter, setZoom } = useMapContext();
  const { addFeature } = useBuilderContext();

  return (
    <Container>
      <DisplayName>{result.display_name}</DisplayName>
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
    </Container>
  );
};

export default SearchResult;
