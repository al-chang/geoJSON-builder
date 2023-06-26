import styled from "styled-components";

type PropertyProps = {
  name: string;
  value: string | number;
  onChange: (name: string, value: string | number) => void;
};

const Container = styled.div`
  color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const PropertyDisplay = styled.textarea`
  width: 100%;
`;

const Property: React.FC<PropertyProps> = ({ name, value, onChange }) => {
  return (
    <Container>
      <PropertyDisplay
        value={name}
        onChange={(e) => onChange(e.target.value, value)}
      />
      <PropertyDisplay
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </Container>
  );
};

export default Property;
