import styled from "styled-components";
import { SideBarContent } from "../App";
import { useBuilderContext } from "../contexts/Builder/useBuilderContext";
import { useMapContext } from "../contexts/Map/useMapContext";

const Options = styled.ul`
  list-style: none;
  padding: 0;
  margin: 5px;
  display: flex;
  justify-content: space-evenly;
`;

export type SideBarSwitchProps = {
  switcher: (tab: SideBarContent) => void;
  currentTab: SideBarContent;
};

const SideBarSwitch: React.FC<SideBarSwitchProps> = ({
  switcher,
  currentTab,
}) => {
  const { exportFeatureCollection, setEditMode } = useBuilderContext();
  const { setPreviewGeoJson } = useMapContext();

  const switcherer = (tab: SideBarContent) => {
    if (currentTab === tab) {
      return;
    }
    setEditMode(false);
    setPreviewGeoJson(null);
    switcher(tab);
  };

  return (
    <nav>
      <Options>
        <li>
          <button onClick={() => switcherer(SideBarContent.Search)}>
            Search
          </button>
        </li>
        <li>
          <button onClick={() => switcherer(SideBarContent.Builder)}>
            Modify
          </button>
        </li>
        <li>
          <button onClick={exportFeatureCollection}>Export</button>
        </li>
      </Options>
    </nav>
  );
};

export default SideBarSwitch;
