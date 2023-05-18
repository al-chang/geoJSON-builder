import Map from "./components/Map/Map";
import styled from "styled-components";
import { BuilderProvider } from "./contexts/Builder/builderProvider";
import { MapProvider } from "./contexts/Map/mapProvider";
import SearchJson from "./components/Search/Search";
import SideBarSwitch from "./components/SideBarSwitch";
import { useState } from "react";
import Builder from "./components/Builder/Builder";

const Content = styled.div`
  display: flex;
  width: 100vw;
`;
const SideBarContainer = styled.div`
  width: 33%;
`;
const MapContainer = styled.div`
  width: 67%;
  height: 100vh;
  position: sticky;
  top: 0;
`;

export enum SideBarContent {
  Search = "SEARCH",
  Builder = "BUILDER",
}

const App = () => {
  const [sideBarContent, setSideBarContent] = useState<SideBarContent>(
    SideBarContent.Search
  );

  const sideBar = () => {
    switch (sideBarContent) {
      case SideBarContent.Search:
        return <SearchJson />;
      case SideBarContent.Builder:
        return <Builder />;
    }
  };

  return (
    <Content>
      <MapProvider>
        <BuilderProvider>
          <SideBarContainer>
            <SideBarSwitch switcher={setSideBarContent} />
            {sideBar()}
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
