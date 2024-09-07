import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ContextActivity = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activitys`);
        setActivities(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoaded(true);
      }
    };
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    fetchActivity();
    fetchTeacher();
  }, []);

  const getActivityByID = (act_ID) => {
    const activity = activities.find((i) => i.act_ID == act_ID);
    return activity;
  };

  return (
    <ContextActivity.Provider
      value={{
        activities,
        setActivities,
        error,
        isLoaded,
        getActivityByID,
        teacher,
        setTeacher,
      }}
    >
      {children}
    </ContextActivity.Provider>
  );
};
