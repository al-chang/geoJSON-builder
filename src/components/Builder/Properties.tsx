import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import { useEffect, useState } from "react";
import { TProperties, metaSymbol } from "../../types";
import Property from "./Property";

type TPropertiesProps = {
  className?: string;
};

type TPropertyData = {
  name: string;
  value: string | number;
  id: string;
};

const Container = styled.div`
  color: black;
`;

export const Properties: React.FC<TPropertiesProps> = ({ className }) => {
  const [show, setShow] = useState(false);
  const [properties, setProperties] = useState<TPropertyData[] | null>(null);

  const { featureCollection, propertyIDEdit } = useBuilderContext();

  useEffect(() => {
    if (propertyIDEdit) {
      setShow(true);
      const _properties = featureCollection.features.find(
        (feature) => feature.properties[metaSymbol].uuid === propertyIDEdit
      )?.properties;
      if (_properties) {
        setProperties(
          Object.entries(_properties || {}).map(([key, value]) => {
            return {
              name: key,
              value: value,
              id: crypto.randomUUID().toString(),
            };
          })
        );
      }
    } else {
      setShow(false);
      setProperties(null);
    }
  }, [propertyIDEdit, featureCollection]);

  return (
    <Container
      className={className}
      style={{ left: show ? "calc(max(350px, 20vw) + 3%)" : "2%" }}
    >
      <button onClick={() => setShow(false)}>Collapse</button>
      {properties?.map(({ id, name, value }) => (
        <Property
          key={id}
          name={name}
          value={value}
          onChange={(name, value) => {
            setProperties((properties) => {
              if (properties) {
                const _properties = [...properties];
                const index = _properties.findIndex(
                  (property) => property.id === id
                );
                _properties[index] = { name, value, id };
                return _properties;
              } else {
                return null;
              }
            });
          }}
        />
      ))}
    </Container>
  );
};

export default Properties;
