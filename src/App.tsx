import "./App.css";
import Builder from "./components/Builder";
import Map from "./components/Map";

function App() {
  return (
    <div className="flex w-screen h-screen">
      <aside className="w-2/6 h-screen flex flex-col">
        <Builder />
      </aside>
      <div className="w-4/6 h-full">
        <Map />
      </div>
    </div>
  );
}

export default App;
