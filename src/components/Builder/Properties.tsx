import styled from "styled-components";
import { TProperties } from "../../types";

type TPropertiesProps = {
  className?: string;
  properties?: TProperties;
};

const Container = styled.div``;

export const Properties: React.FC<TPropertiesProps> = ({
  className,
  properties,
}) => {
  return <Container className={className}>test</Container>;
};

export default Properties;
