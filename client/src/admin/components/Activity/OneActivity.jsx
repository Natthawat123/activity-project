import React, { Suspense } from "react";
import { ActivityProvider } from "./ActivityContext.jsx";

const ActivityDetail = React.lazy(() => import("./DetailActivity.jsx"));
const ListReserveStudent = React.lazy(() => import("./ListReserveStudent.jsx"));

function OneActivity() {
  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <ActivityProvider>
          <Suspense fallback={<div>Loading Activity Details...</div>}>
            <ActivityDetail />
          </Suspense>
          <Suspense fallback={<div>Loading Student List...</div>}>
            <ListReserveStudent />
          </Suspense>
        </ActivityProvider>
      </div>
    </div>
  );
}

export default OneActivity;
