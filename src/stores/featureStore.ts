import { TFeature } from "@/types";
import { UUID } from "crypto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TFeatureStore = {
  features: TFeature[];
  addFeature: (feature: TFeature) => void;
  removeFeature: (id: UUID) => void;
  setVisibility: (id: UUID, visibiltiy: boolean) => void;
  reset: () => void;
};

const useFeatureStore = create<TFeatureStore>()(
  persist(
    (set) => ({
      features: [],
      addFeature: (feature: TFeature) =>
        set((state) => ({ features: [...state.features, feature] })),
      removeFeature: (id: UUID) =>
        set((state) => ({
          features: state.features.filter(
            (feature) => feature.meta.uuid !== id
          ),
        })),
      setVisibility: (id, visiblity) =>
        set((state) => ({
          features: state.features.map((feature) => {
            if (feature.meta.uuid === id) {
              return {
                ...feature,
                meta: {
                  ...feature.meta,
                  visible: visiblity,
                },
              };
            } else {
              return feature;
            }
          }),
        })),
      reset: () => set(() => ({ features: [] })),
    }),
    { name: "feature" }
  )
);

export default useFeatureStore;
