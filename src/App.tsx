import Map from "./components/Map/Map";
import styled from "styled-components";
import { BuilderProvider } from "./contexts/Builder/builderProvider";
import { MapProvider } from "./contexts/Map/mapProvider";
import SearchJson from "./components/Search/Search";
import Builder from "./components/Builder/Builder";
import Properties from "./components/Builder/Properties";

const Content = styled.div`
  display: flex;
  width: 100vw;
`;
const SideBarContainer = styled.div`
  z-index: 1;
  position: absolute;
  width: 20vw;
  height: 90vh;
  left: 2%;
  top: 2%;
  background-color: #242424;
  border-radius: 15px;
  box-shadow: 0 0 10px grey;
  min-width: 350px;
  display: flex;
  flex-direction: column;
`;
const StyledProperties = styled(Properties)`
  position: absolute;
  top: 0;
  left: 20px;
  width: 100%;
  height: 90vh;
  background-color: white;
  border-top: 1px solid black;
  border-radius: 15px;
  z-index: -1;

  @keyframes identifier {
  }
`;
const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: sticky;
  top: 0;
`;

const App = () => {
  return (
    <Content>
      <MapProvider>
        <BuilderProvider>
          <SideBarContainer>
            <div style={{ position: "relative" }}>
              <SearchJson />
              <Builder />
            </div>
            {/* <StyledProperties /> */}
          </SideBarContainer>
          <MapContainer>
            <Map />
          </MapContainer>
        </BuilderProvider>
      </MapProvider>
    </Content>
  );
};

export default App;
