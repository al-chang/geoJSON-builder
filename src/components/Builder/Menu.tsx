import useFeatureStore from "@/stores/featureStore";
import { TFeature, TFeatureCollection } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const Menu = () => {
  const { features, reset } = useFeatureStore();
  const exportFeatures = () => {
    const _featureCollection: TFeatureCollection = {
      type: "FeatureCollection",
      features: features.map(
        (feature) =>
          ({
            geometry: feature.geometry,
            type: "Feature",
            properties: feature.properties,
          } as TFeature)
      ),
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(_featureCollection));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `features.geojson`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <HamburgerMenuIcon />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white dark:bg-black rounded py-2 px-4 border-solid border-2 border-black">
          <DropdownMenu.Item className="text-blue-700 dark:text-white rounded py-2">
            <button
              className="p-0 bg-transparent border-none w-full text-center"
              onClick={exportFeatures}
            >
              Export
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-blue-700 dark:text-white rounded py-2">
            <button
              className="p-0 bg-transparent border-none w-full text-center"
              onClick={reset}
            >
              Reset
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Menu;
