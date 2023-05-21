import React from "react";
import { fromLonLat } from "ol/proj";
import { TSearchResponse } from "../../types";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { geometryCenter } from "../../util";
import styled from "styled-components";
import { Show } from "styled-icons/boxicons-regular";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid grey;
  background-color: black;
  justify-content: space-between;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

const DisplayName = styled.h3`
  margin: 5px;
  padding: 0;
  font-size: small;
  font-weight: normal;
  flex-basis: 80%;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100px;
  flex-basis: 20%;

  button {
    :first-child {
      border-radius: 5px 0 0 5px;
    }
    :last-child {
      border-radius: 0 5px 5px 0;
    }
  }
`;

type SearchResultProps = {
  result: TSearchResponse;
};

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  const { setPreviewGeoJson, setCenter, setZoom } = useMapContext();
  const { dispatchFeatureCollection } = useBuilderContext();

  return (
    <Container>
      <DisplayName>{result.display_name}</DisplayName>
      <Actions>
        <button
          type="button"
          onClick={() => {
            setPreviewGeoJson(result.geojson);
            // TODO: set zoom based on size
            setZoom(10);
            setCenter(fromLonLat(geometryCenter(result.geojson)));
          }}
          style={{ margin: 0, width: "100%", height: "100%" }}
        >
          <Show width="100%" height="100%" />
        </button>
        <button
          type="button"
          onClick={() => {
            dispatchFeatureCollection({ type: "addFeature", payload: result });
            setPreviewGeoJson(null);
          }}
        >
          +
        </button>
      </Actions>
    </Container>
  );
};

export default SearchResult;
