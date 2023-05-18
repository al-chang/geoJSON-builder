import SearchJson from "./components/SearchJson";
import Map from "./components/Map/Map";
import styled from "styled-components";
import { BuilderProvider } from "./contexts/Builder/builderProvider";
import { MapProvider } from "./contexts/Map/mapProvider";

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
