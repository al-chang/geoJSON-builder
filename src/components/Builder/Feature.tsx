import styled from "styled-components";
import { TFeature as FeatureType } from "../../types";
import { GeoJSONCenter } from "../../util";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { fromLonLat } from "ol/proj";
import { Delete } from "@styled-icons/material/Delete";
import { Edit } from "@styled-icons/material/Edit";
import { Hide, Show } from "styled-icons/boxicons-regular";
import { Locate } from "styled-icons/ionicons-outline";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid white;
  margin: 5px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100px;
`;

const ActionButton = styled.button`
  margin: 0;
  padding: 0;
`;

type FeatureProps = {
  feature: FeatureType;
};

const Feature: React.FC<FeatureProps> = ({ feature }) => {
  const { setCenter } = useMapContext();
  const { removeFeature, toggleFeatureVisibility } = useBuilderContext();

  const goToCenter = () => {
    const center = GeoJSONCenter(feature.geometry);
    setCenter(fromLonLat(center));
  };

  const deleteFeature = () => {
    removeFeature(feature.properties.meta.uuid);
  };

  const toggleVisibility = () => {
    toggleFeatureVisibility(feature.properties.meta.uuid);
  };

  return (
    <Container>
      <h3>{feature.properties.name as string}</h3>
      <Actions>
        <ActionButton onClick={goToCenter}>
          =
          <Locate onClick={goToCenter} />
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
