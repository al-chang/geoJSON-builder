import useDebouncedState from "@/hooks/useDebouncedState";
import { getGeoJson, searchGeoJson } from "@/services/searchService";
import useFeatureStore from "@/stores/featureStore";
import { TGeometry, TSearchResponse } from "@/types";
import { geometryToFeature } from "@/utils";
import { useCombobox } from "downshift";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import useMapStore from "@/stores/mapStore";

const itemToString = (item: TSearchResponse | null): string =>
  item?.display_name ?? "N/A";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useDebouncedState("", 500);
  const [results, setResults] = useState<TSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const { addFeature } = useFeatureStore();
  const { centerOnGeometry } = useMapStore();

  const {
    getInputProps,
    getMenuProps,
    isOpen,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: results,
    itemToString,
    onInputValueChange: ({ inputValue }) => setSearchTerm(inputValue ?? ""),
    onSelectedItemChange: async ({ selectedItem }) => {
      // Check for osm id
      if (selectedItem?.osm_id === undefined) {
        console.error("No OSM ID for this place");
        return;
      }
      let geometry: TGeometry;
      try {
        const res = await getGeoJson(selectedItem.osm_id.toString());
        geometry = res?.geometry;
      } catch {
        // If we are in the catch then the place is a point
        geometry = {
          type: "Point",
          coordinates: [
            parseFloat(selectedItem.lon),
            parseFloat(selectedItem.lat),
          ],
        } as TGeometry;
      }
      addFeature(
        geometryToFeature(geometry, {
          name: selectedItem?.display_name,
          place_id: selectedItem?.place_id,
          osm_id: selectedItem?.osm_id,
        })
      );
      centerOnGeometry(geometry);
    },
  });

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const _results = await searchGeoJson(searchTerm);
      setResults(_results ?? []);
      setLoading(false);
    };

    search();
  }, [searchTerm]);

  return (
    <div className="relative p-2">
      <div className="relative">
        <div className="flex">
          <input
            className="w-full p-2 mr-1 border border-indigo-300 dark:border-none"
            {...getInputProps({
              type: "search",
              id: "search",
            })}
            autoFocus
            placeholder="Search for a location"
          />
          <Menu />
        </div>
        <ul
          {...getMenuProps()}
          className="absolute w-full bg-slate-200 dark:bg-black z-50"
        >
          {isOpen &&
            (loading ? (
              // Credit to https://flowbite.com/docs/components/spinner/
              <div
                className="m-8 flex align-middle justify-center"
                role="status"
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              results.map((result, index) => (
                <li
                  key={result.osm_id}
                  className={`cursor-pointer m-1 rounded px-2 py-1 ${
                    index === highlightedIndex && "bg-gray-400 dark:bg-gray-600"
                  }`}
                  {...getItemProps({
                    item: result,
                    index,
                  })}
                >
                  {result.display_name}
                </li>
              ))
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
