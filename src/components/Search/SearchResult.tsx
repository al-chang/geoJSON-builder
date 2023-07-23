import React, { useRef } from "react";
import { fromLonLat } from "ol/proj";
import { TGeometry, TSearchResponse } from "../../types";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { calculateZoomFromBoundingBox, geometryCenter } from "../../util";
import styled from "styled-components";
import { Plus, Show } from "styled-icons/boxicons-regular";
import { getGeoJson } from "../../service/searchService";

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
    margin: 0;
    width: "100%";
    height: "100%";
    padding: 0;
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
  const previewButton = useRef<HTMLButtonElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);

  const { setPreviewGeoJson, setCenter, setZoom } = useMapContext();
  const { dispatchFeatureCollection } = useBuilderContext();

  return (
    <Container>
      <DisplayName>{result.display_name}</DisplayName>
      <Actions>
        <button
          type="button"
          ref={previewButton}
          onClick={async () => {
            let geoJson;
            try {
              geoJson = (await getGeoJson(`${result.osm_id}`)).geometry;
            } catch {
              geoJson =
                result.geojson ??
                ({
                  type: "Point",
                  coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
                } as TGeometry);
            }
            setPreviewGeoJson(geoJson);
            setZoom(
              calculateZoomFromBoundingBox({
                minX: parseFloat(result.boundingbox[2]),
                minY: parseFloat(result.boundingbox[0]),
                maxX: parseFloat(result.boundingbox[3]),
                maxY: parseFloat(result.boundingbox[1]),
              })
            );
            setCenter(fromLonLat(geometryCenter(geoJson)));
          }}
        >
          <Show />
        </button>
        <button
          type="button"
          ref={addButton}
          onClick={() => {
            dispatchFeatureCollection({ type: "addFeature", payload: result });
            setPreviewGeoJson(null);
          }}
        >
          <Plus />
        </button>
      </Actions>
    </Container>
  );
};

export default SearchResult;
