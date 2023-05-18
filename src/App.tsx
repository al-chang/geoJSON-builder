import SearchJson from "./components/SearchJson";
import { BuilderProvider } from "./hooks/useBuilder";
import { MapProvider } from "./hooks/useMap";
import Map from "./components/Map/Map";
import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  width: 100vw;
`;
const LeftContainer = styled.div`
  width: 33%;
`;
const RightContainer = styled.div`
  width: 67%;
  height: 100vh;
`;

const App = () => {
  return (
    <Content>
      <MapProvider>
        <BuilderProvider>
          <LeftContainer>
            <SearchJson />
          </LeftContainer>
          <RightContainer>
            <Map />
          </RightContainer>
        </BuilderProvider>
      </MapProvider>
    </Content>
  );
};

export default App;
