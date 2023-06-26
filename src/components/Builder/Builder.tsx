import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import Feature from "./Feature";
import { useMapContext } from "../../contexts/Map/useMapContext";
import Vector from "ol/layer/Vector";
import { GeoJSON } from "ol/format";
import { TFeature, TFeatureCollection, metaSymbol } from "../../types";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #242424;
`;

const FeatureContainer = styled.div`
  overflow: scroll;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #242424;
`;

const Builder: React.FC = () => {
  const {
    editMode,
    featureCollection,
    setEditMode,
    dispatchFeatureCollection,
    exportFeatureCollection,
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
        <button onClick={() => exportFeatureCollection()}>Export</button>
      </Header>
      <FeatureContainer>
        {featureCollection.features.map((feature) => (
          <Feature
            key={feature.properties[metaSymbol].uuid}
            feature={feature}
          />
        ))}
      </FeatureContainer>
    </>
  );
};

export default Builder;
