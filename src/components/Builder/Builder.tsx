import styled from "styled-components";
import { useBuilderContext } from "../../contexts/Builder/useBuilderContext";
import Feature from "./Feature";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Builder: React.FC = () => {
  const { editMode, featureCollection, setEditMode, saveEdits } =
    useBuilderContext();

  return (
    <>
      <Header>
        {editMode ? (
          <>
            <button
              onClick={() => {
                saveEdits();
              }}
            >
              Save
            </button>{" "}
            <button
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit</button>
        )}
      </Header>
      {featureCollection.features.map((feature) => (
        <Feature key={feature.properties.place_id} feature={feature} />
      ))}
    </>
  );
};

export default Builder;
