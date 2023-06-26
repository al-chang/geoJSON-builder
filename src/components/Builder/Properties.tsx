import styled from "styled-components";
import { TProperties } from "../../types";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";

type TPropertiesProps = {
  className?: string;
  properties?: TProperties;
};

const Container = styled.div``;

export const Properties: React.FC<TPropertiesProps> = ({
  className,
  properties,
}) => {
  const { featureCollection, propertyIDEdit } = useBuilderContext();

  return (
    <Container
      className={className}
      style={{ left: propertyIDEdit ? "10%" : "2%" }}
    >
      {propertyIDEdit}
    </Container>
  );
};

export default Properties;
