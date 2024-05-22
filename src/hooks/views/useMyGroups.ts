import { useEffect, useState } from "react";
import useAPI from "../useAPI";
import { IGROUP } from "@/types";
import useAuth from "@/hooks/useAuth";


export default function useMyGroups() {
  const api = useAPI();
  const [myGroups, setGroups] = useState<IGROUP[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await api.post("api/getGroup", {id:user?.id});
      setGroups(response.data);
    };

    fetchGroups();
  }, []);

  return myGroups;
}
