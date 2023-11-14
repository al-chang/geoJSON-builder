import useFeatureStore from "@/stores/featureStore";
import SearchBar from "./SearchBar";
import Feature from "./Feature";

const Builder = () => {
  const { features } = useFeatureStore();
  return (
    <>
      <div className="flex-grow-0 flex-shrink basis-auto">
        <SearchBar />
      </div>
      <div className="overflow-y-auto flex-grow flex-shrink basis-auto">
        {features.map((feature) => (
          <Feature key={feature.meta.uuid} feature={feature} />
        ))}
      </div>
    </>
  );
};

export default Builder;
