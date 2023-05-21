import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import Feature from "./Feature";
import { useMapContext } from "../../contexts/Map/useMapContext";
import Vector from "ol/layer/Vector";
import { GeoJSON } from "ol/format";
import { TFeature, TFeatureCollection } from "../../types";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Builder: React.FC = () => {
  const {
    editMode,
    featureCollection,
    setEditMode,
    dispatchFeatureCollection,
  } = useBuilderContext();
  const { map } = useMapContext();

  return (
    <>
      <Header>
        {editMode ? (
          <>
            <button
              onClick={() => {
                const features: TFeature[] = [];
                map
                  ?.getLayers()
                  .getArray()
                  .forEach((layer) => {
                    if (layer instanceof Vector) {
                      const _features = new GeoJSON().writeFeaturesObject(
                        layer.getSource().getFeatures(),
                        { featureProjection: "EPSG:3857" }
                      ) as TFeatureCollection;
                      _features.features.forEach((feature) => {
                        features.push(feature);
                      });
                    }
                  });
                dispatchFeatureCollection({
                  type: "saveEdits",
                  payload: features,
                });
                setEditMode(false);
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit</button>
        )}
      </Header>
      {featureCollection.features.map((feature) => (
        <Feature key={feature.properties.meta.uuid} feature={feature} />
      ))}
    </>
  );
};

export default Builder;
