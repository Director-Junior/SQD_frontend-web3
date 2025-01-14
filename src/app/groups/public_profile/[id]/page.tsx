"use client";

import React, { useEffect, useState } from "react";

import GroupDescription from "@/components/groups/share/groupDescription";
import Image from "next/image";
import Split_line from "@/components/main/split_line";
import Footer from "@/components/main/footer/footer";
import EyeIcon from "@/components/svgs/eye_icon";
import HeartIcon from "@/components/svgs/heart_icon";
import { useRouter } from "next/navigation";
import useLoadingControlStore from "@/store/UI_control/loading";

//import data
import MyGroups from "@/data/groups.json";
import Nfts from "@/data/sold_nfts.json";
import useAPI from "@/hooks/useAPI";
import { IGROUP, IUSER, INFT } from "@/types";
import useAuth from "@/hooks/useAuth";

const ShareGroupProfile = ({ params }: { params: { id: string } }) => {
  const setLoadingState = useLoadingControlStore(
    (state) => state.updateLoadingState
  );
  useEffect(() => {
    document.body.style.overflow = "auto";
    setLoadingState(false);
  }, [setLoadingState]);
  const router = useRouter();
  function scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top;
      const windowScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: elementTop - 180 + windowScrollTop,
        behavior: "smooth",
      });
    }
  }

  const [members, setMembers] = useState<IUSER[] | undefined>(undefined);

  const { signIn, isAuthenticated, user } = useAuth();
  const [myGroupData, setMyGroupData] = useState<IGROUP | undefined>(undefined);
  const [nftData, setNftData] = useState<INFT[] | undefined>(undefined);
  const api = useAPI();
  const getMyGroupData = async () => {

    const { data: Data } = await api.post(`/api/getGroupId`, { id: params.id });
    setMyGroupData(Data);
  }

  const getNftData = async () => {
    const {data: Data} = await api.post('/api/getNftByGroupAndStatus', {id:params.id, status:'list'}) ;
    setNftData(Data) ;
    console.log("here is nft Data", Data) ;
  }

  useEffect(() => {
    getMyGroupData();
    getNftData() ;
  }, []);

  const getMembersData = async (id: string) => {
    console.log("id", id);
    const { data } = await api.get(`/auth/user/${id}`);
    console.log("DataDATA ---------> ", data);
    return data;
  }
  useEffect(() => {
    if (!myGroupData) return;
    (async() => {
      const _members = await Promise.all(myGroupData.member.map(async(_member: any) => await getMembersData(_member.id)));
      setMembers(_members);
    }) ();

  }, [myGroupData])




  return (
    <>
      <div className="pt-[100px] h-full">
        <div className="grouppage_container flex font-Maxeville" id="profile">
          <div>
            <div className="gap-4 grid xl:grid-cols-2 lg:grid-cols-1 xl:w-[50%] xl:min-w-[920px] xs:p-0">
              <div className="mt-5">
                {
                  myGroupData && <Image
                    src={myGroupData?.avatar}
                    className="w-full aspect-square object-cover"
                    alt="group_avatar"
                    width={300}
                    height={300}
                  />
                }

              </div>
              <div className="mt-5">
                {
                  members && myGroupData &&
                  <GroupDescription users={members} myGroupData={myGroupData} />
                }

              </div>
            </div>
          </div>
        </div>
        <div className="sticky top-[100px] z-10 hidden md:block">
          <nav className="bg-white bg-opacity-95 border-b-[1px] grouppage_container font-Maxeville">
            <div>
              <div className="flex items-center h-16">
                <div className="flex items-center cursor-pointer">
                  <div className="flex-shrink-0">{/* Logo */}</div>
                  <div className="">
                    <div className="flex items-baseline space-x-4">
                      <a
                        onClick={() => {
                          scrollToElement("profile");
                        }}
                        className="border-b-2 border-transparent hover:border-gray-400 py-2 text-lg"
                      >
                        PROFILE
                      </a>
                      <a
                        onClick={() => {
                          scrollToElement("nfts");
                        }}
                        className="border-b-2 border-transparent hover:border-gray-400 px-3 py-2 text-lg"
                      >
                        NFTs
                      </a>
                      <a
                        onClick={() => {
                          scrollToElement("post");
                        }}
                        className="border-b-2 border-transparent hover:border-gray-400 px-3 py-2 text-lg"
                      >
                        POST
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="grouppage_container font-Maxeville">
          <div className="flex justify-between text-xl mt-5" id="nfts">
            <div>NFTs (23)</div>
            <div className="border-b-2 border-indigo-500"></div>
          </div>
          <div className="mb-[50px] grid grid-cols-6 gap-4 mt-5 xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2">
            {nftData?.map((item, index) => (
              <div
                key={index}
                className="relative aspect-square text-md content-card cursor-pointer drop-shadow-md"
                onClick={() => router.push(`/details/public/${item.id}`)}
              >
                <div className="absolute aspect-square top-0 content-card-menu opacity-0 transition-all rounded-lg text-white bg-chocolate-main/80 w-full">
                  <div>
                    <div className="absolute left-4 top-4">{item.collectionname} {item.collectionid}</div>
                    <div className="absolute left-4 bottom-4">{item.currentprice} USDC</div>
                    <div className="absolute right-4 bottom-4 flex items-center gap-1 sm:gap-2 xs:hidden">
                      <EyeIcon props="white" />
                      200
                      <HeartIcon props="white" />
                      20
                    </div>
                  </div>
                </div>
                <Image
                  src={item.avatar}
                  className="w-full h-full aspect-square object-cover rounded-lg"
                  alt="market_nft"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
                <div className="mt-3">{""}</div>
              </div>
            ))}
          </div>
          <Split_line />

          <div className="flex justify-between text-lg mt-5" id="post">
            <div>NEWS</div>
            <div className="border-b-2 border-indigo-500">VIEW ALL</div>
          </div>
          <div
            style={{ borderBottom: "3px solid #ccc" }}
            className="mt-5 mb-3 w-[26%]"
          ></div>
          <div>
            {[1, 2].map((item: number) => (
              <div key={item}>
                <div className="flex text-lg gap-5">
                  <div className="w-10 h-10 bg-gray-500 aspect-square rounded-full">
                    <Image
                      src="/user.png"
                      className="w-full h-full rounded-full"
                      alt="news_avatar"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>We are looking for a talented photographer.</div>
                </div>
                <Split_line />
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-[-400px] bg-cover bg-no-repeat h-[920px] w-full -z-10"
          style={{ backgroundImage: "url('/assets/bg-1.jpg')" }}
        ></div>
        <Footer />
      </div>
    </>
  );
};

export default ShareGroupProfile;
