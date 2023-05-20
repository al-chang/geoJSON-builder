import Builder from "./Builder/Builder";
import SearchJson from "./Search/Search";

export const SideBar = () => {
  return (
    <>
      <div>
        <SearchJson />
        <Builder />
      </div>
    </>
  );
};

export default SideBar;
