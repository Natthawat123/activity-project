import { Suspense, lazy } from "react";
const CS = lazy(() => import("../../components/Calendar"));

function Calendar() {
  return (
    <div className="pt-10 md:pt-16">
      <Suspense fallback={<div>Loading...</div>}>
        <CS />
      </Suspense>
    </div>
  );
}

export default Calendar;
