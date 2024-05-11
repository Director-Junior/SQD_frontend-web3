/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

//import component
import Card from "@/components/main/cards/groupCard";
//import hook
import useAPI from "@/hooks/useAPI";
import useAuth from "@/hooks/useAuth";
//import types
import { IGROUP } from "@/types";
//import store
import useCreatGroupState from "@/store/createGroupStatus";

const MyGroup = () => {
  //use state
  const [allGroupData, setAllGroupData] = useState<IGROUP[]>([]);
  //use auth
  const { signIn, isAuthenticated, user } = useAuth();
  //use api
  const api = useAPI();
  //zustand
  const createGroupState = useCreatGroupState((state) => state.state);
  const updateCreateGroupState = useCreatGroupState(
    (state) => state.updateState
  );
  //func
  const getJoinedGroupData = async () => {
    const { data: Data } = await api.post(`/api/getGroup`, { id: user?.id });
    setAllGroupData(Data);
    updateCreateGroupState("ready");
  };
  //use effect
  useEffect(() => {
    getJoinedGroupData();
  }, [user]);

  useEffect(() => {
    if (createGroupState == "just_created") getJoinedGroupData();
  }, [createGroupState]);

  return (
    <div>
      <h1 className="my-5 text-lg">MY GROUPS</h1>
      <div className="gap-3 flex-wrap grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {allGroupData.map((item, index) => (
          <Card
            key={index}
            state={"2"}
            name={item.name}
            groupBio={item.description}
            membercount={item.member.length}
            groupId={item.id}
            avatar={item.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default MyGroup;
