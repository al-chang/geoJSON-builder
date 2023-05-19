import styled from "styled-components";
import { SideBarContent } from "../App";
import { useBuilderContext } from "../contexts/Builder/useBuilderContext";

const Options = styled.ul`
  list-style: none;
  padding: 0;
  margin: 5px;
  display: flex;
  justify-content: space-evenly;
`;

export type SideBarSwitchProps = {
  switcher: (tab: SideBarContent) => void;
};

const SideBarSwitch: React.FC<SideBarSwitchProps> = ({ switcher }) => {
  const { exportFeatureCollection } = useBuilderContext();

  return (
    <nav>
      <Options>
        <li>
          <button onClick={() => switcher(SideBarContent.Search)}>
            Search
          </button>
        </li>
        <li>
          <button onClick={() => switcher(SideBarContent.Builder)}>
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
