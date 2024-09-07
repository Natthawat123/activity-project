import { lazy, Suspense } from "react";
import { ActivityProvider } from "../components/Activity/ActivityContext";

const ListActivity = lazy(() => import("../components/Activity/ListActivity"));
const Dash_activity = lazy(() => import("../components/Dash_activity"));

function Activity() {
  return (
    <div className="container mx-auto px-8 sm:px-10 md:px-10 lg:px-20 mb-5 md:grid md:grid-cols-1 lg:grid-cols-1 pt-10  md:pt-20">
      <Suspense fallback={<div>Loading Activity Details...</div>}>
        <div className="w-full  mb-4 md:mb-0 md:mr-4">
          <Dash_activity />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading Activity Details...</div>}>
        <div className="w-full">
          <ActivityProvider>
            <ListActivity />
          </ActivityProvider>
        </div>
      </Suspense>
    </div>
  );
}

export default Activity;
