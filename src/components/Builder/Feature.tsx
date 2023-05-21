import styled from "styled-components";
import { TFeature as FeatureType } from "../../types";
import {
  calculateBoundingBox,
  calculateZoomFromBoundingBox,
  geometryCenter,
} from "../../util";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { fromLonLat } from "ol/proj";
import { Delete } from "@styled-icons/material/Delete";
import { Edit } from "@styled-icons/material/Edit";
import { Hide, Show } from "styled-icons/boxicons-regular";
import { Locate } from "styled-icons/ionicons-outline";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid grey;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  &:only-child {
    border-radius: 5px;
  }
`;

const Header = styled.h3`
  margin: 0;
  font-size: medium;
  padding: 5px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

const ActionButton = styled.button`
  margin: 0;
  padding: 10px;
  width: 40px;
  height: "100%";
`;

type FeatureProps = {
  feature: FeatureType;
};

const Feature: React.FC<FeatureProps> = ({ feature }) => {
  const { setCenter, setZoom } = useMapContext();
  const { dispatchFeatureCollection } = useBuilderContext();

  const goToCenter = () => {
    const center = geometryCenter(feature.geometry);
    const boundingBox = calculateBoundingBox(feature.geometry);
    const zoomLevel = calculateZoomFromBoundingBox(boundingBox);
    setZoom(zoomLevel);
    setCenter(fromLonLat(center));
  };

  const deleteFeature = () => {
    dispatchFeatureCollection({
      type: "removeFeature",
      payload: feature.properties.meta.uuid,
    });
  };

  const toggleVisibility = () => {
    dispatchFeatureCollection({
      type: "toggleFeatureVisibility",
      payload: feature.properties.meta.uuid,
    });
  };

  return (
    <Container>
      <Header>
        {(feature.properties.name as string) || feature.properties.meta.uuid}
      </Header>
      <Actions>
        <ActionButton onClick={goToCenter}>
          <Locate />
        </ActionButton>
        <ActionButton onClick={toggleVisibility}>
          {feature.properties.meta.visible ? <Hide /> : <Show />}
        </ActionButton>
        <ActionButton>
          <Edit />
        </ActionButton>
        <ActionButton onClick={deleteFeature}>
          <Delete color="red" />
        </ActionButton>
      </Actions>
    </Container>
  );
};

export default Feature;
