import useFeatureStore from "@/stores/featureStore";
import { TFeature } from "@/types";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import * as Switch from "@radix-ui/react-switch";
import EditProperties from "./EditProperties";
import useMapStore from "@/stores/mapStore";

type FeatureProps = {
  feature: TFeature;
};

const Feature: React.FC<FeatureProps> = ({ feature }) => {
  const { removeFeature, setVisibility } = useFeatureStore();
  const { centerOnGeometry } = useMapStore();

  return (
    <div className="border-solid border-blue-700 border-2 m-2 p-2 rounded dark:bg-slate-900">
      <h3 className="pb-2">{feature.properties.name}</h3>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Switch.Root
            id={`${feature.meta.uuid}-visibility`}
            className="group w-[42px] h-[15px] bg-black rounded-full relative data-[state=checked]:bg-blue-700 outline-none p-0 border-none"
            onCheckedChange={(val) => setVisibility(feature.meta.uuid, val)}
            defaultChecked={feature.meta.visible}
          >
            <Switch.Thumb className="block w-[21px] h-[21px] border-black border dark:border-none bg-white rounded-full transition-transform duration-100 -translate-y-[3px] translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[21px] group-hover:data-[state=unchecked]:translate-x-[6px] group-hover:data-[state=checked]:translate-x-[17px] " />
          </Switch.Root>
          <label htmlFor={`${feature.meta.uuid}-visibility`} className="ml-2">
            {feature.meta.visible ? (
              <EyeOpenIcon
                height={20}
                width={20}
                aria-label="Toggle visiblity"
              />
            ) : (
              <EyeClosedIcon
                height={20}
                width={20}
                aria-label="Toggle visiblity"
              />
            )}
          </label>
        </div>
        <div className="flex">
          <button
            className="p-0 px-1 bg-transparent border-none transition-colors duration-200 hover:text-emerald-500"
            onClick={() => centerOnGeometry(feature.geometry)}
            aria-label={`Delete ${feature.properties.name}`}
          >
            <MagnifyingGlassIcon height={20} width={20} />
          </button>

          <EditProperties />
          <button
            className="p-0 px-1 bg-transparent border-none"
            onClick={() => removeFeature(feature.meta.uuid)}
            aria-label={`Delete ${feature.properties.name}`}
          >
            <TrashIcon
              className="transition-colors duration-200 hover:text-red-500"
              height={20}
              width={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feature;
