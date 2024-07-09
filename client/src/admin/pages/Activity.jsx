import Dash_activity from "../components/Dash_activity";
import ListActivity from "../components/ListActivity";
import Popup from "../components/Popup_addAc";

function Activity() {
  return (
    <div className="container mx-auto px-8 sm:px-10 md:px-10 lg:px-20 mb-5 md:grid md:grid-cols-1 lg:grid-cols-1">
      <div className="">
        <div className="w-full  mb-4 md:mb-0 md:mr-4">
          <Dash_activity />
        </div>
        <div className="w-full">
          <ListActivity />
        </div>
      </div>
    </div>
  );
}

export default Activity;
