import styled from "styled-components";
import { TFeature as FeatureType } from "../../types";
import { GeoJSONCenter } from "../../util";
import { useMapContext } from "../../contexts/Map/useMapContext";
import { fromLonLat } from "ol/proj";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid white;
  margin: 5px;
`;

type FeatureProps = {
  feature: FeatureType;
};

const Feature: React.FC<FeatureProps> = ({ feature }) => {
  const { setCenter } = useMapContext();

  const goToCenter = () => {
    const center = GeoJSONCenter(feature.geometry);
    setCenter(fromLonLat(center));
  };

  return (
    <Container>
      <h3>{feature.properties.name}</h3>
      <button onClick={goToCenter}>Find</button>
      <button>Hide</button>
      <button>Edit</button>
      <button>Remove</button>
    </Container>
  );
};

export default Feature;
