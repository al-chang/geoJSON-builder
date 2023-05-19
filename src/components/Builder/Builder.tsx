import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import Feature from "./Feature";

const Builder: React.FC = () => {
  const { featureCollection } = useBuilderContext();

  return (
    <>
      {featureCollection.features.map((feature) => (
        <Feature key={feature.properties.place_id} feature={feature} />
      ))}
    </>
  );
};

export default Builder;
