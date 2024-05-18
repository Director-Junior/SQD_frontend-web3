"use client";
import useGroupUIControlStore from "@/store/UI_control/groupPage/newgroupPage";
import React, { useState, useEffect } from "react";
import { IGROUP, IUSER, INFT, ICOLLECTION } from "@/types";
import { Contract } from "ethers";
import GROUP_ABI from "@/constants/creator_group.json";
import { Marketplace_ADDRESSES } from "@/constants/config";
import MARKETPLACE_ABI from "@/constants/marketplace.json";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import dynamic from "next/dynamic";
import useActiveWeb3 from "@/hooks/useActiveWeb3";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { IMGBB_API_KEY } from "@/constants/config";
import InputInfo from "@/components/main/infoInput";
import useAPI from "@/hooks/useAPI";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userAtom } from "@/store/user";
import toast from "react-hot-toast";
import useDisplayingControlStore from "@/store/UI_control/displaying";

const acceptables = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
const CreateProfileModal = () => {
  const setIsDisplaying = useDisplayingControlStore(
    (state) => state.updateDisplayingState
  );

  const setProfileModalState = useGroupUIControlStore(
    (state) => state.updateProfileModal
  );
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [preview, setPreview] = React.useState<string>("");
  const [avatar, setAvatar] = React.useState<File | undefined>(undefined);
  const [isInvalid, setIsInvalid] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { address, chain, isConnected, chainId } = useActiveWeb3();
  const { signUp, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const api = useAPI();
  const [user1, setUser1] = useAtom(userAtom);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) throw "no files";
      const file: File = event.target.files[0];
      if (!file) throw "Emptry file";
      if (!acceptables.includes(file.type)) throw "Invalid Image file.";
      if (file.size > 32 * 1024 * 1024)
        throw "Overflow maximum file size (32MB).";
      setAvatar(file);
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const _file: string = String(reader.result);
        setPreview(_file);
      };
    } catch (err) {
      toast.error("An error occurred. please try again");
      setPreview("");
    }
  };
  const removeAvatar = () => {
    setPreview("");
  };
  const _submitRegister = async () => {
    try {
      setIsLoading(true);
      setIsDisplaying(true);
      let _avatar = "";
      if (avatar) {
        const formData = new FormData();
        formData.append("image", avatar);
        const {
          data: { url: _newAvatar },
        } = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
        _avatar = _newAvatar;
      }
      const data = { name, email, avatar: _avatar };
      if (user1) {
        console.log("update process");
        const response = await api
          .put("/user", {
            avatar: _avatar,
            name,
            email,
          })
          .catch((error) => {
            toast.error(error.message);
          });
        if (response?.data === "Update Success") {
          if (user1) {
            setUser1({ ...user1, avatar: _avatar, email, name });
          }
          setAvatar(avatar);
          toast.success("Profile Updated Successfully.");
        } else {
          toast.error("Profile Updating Failed.");
        }
      } else {
        await signUp(data);
      }
      router.push("/profile");
    } catch (err) {
    } finally {
      setIsLoading(false);
      setIsDisplaying(false);
    }
  };
  const handleSubmit = () => {
    if (isLoading) return;
    setIsInvalid(true);
    let valid = true;
    if (!name) {
      toast.error("Input your fullname");
      valid = false;
    }
    if (valid) {
      if (!isConnected) {
        toast.error("Connect your wallet!");
      } else {
        _submitRegister();
      }
    }
  };
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPreview(String(user.avatar));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  React.useEffect(() => {
    console.log("preview changed!!!");
    console.log(preview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);
  return (
    <>
      <div className="z-100 font-Maxeville">
        <div
          className="bg-chocolate-main/50 w-[100vw] h-[100vh] fixed top-0 z-[1000]"
          onClick={() => {
            setProfileModalState(false);
          }}
        ></div>
        <div className="generalModal z-[1300] drop-shadow-lg">
          <div
            className="closeBtn"
            onClick={() => {
              setProfileModalState(false);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.6 16L0 14.4L6.4 8L0 1.6L1.6 0L8 6.4L14.4 0L16 1.6L9.6 8L16 14.4L14.4 16L8 9.6L1.6 16Z"
                fill="#322A44"
              />
            </svg>
          </div>
          <div
            className={`p-5  rounded-lg sm:h-[500px] h-[600px] flex flex-col justify-between`}
          >
            <div className="flex w-full flex-col gap-2 text-[#141416] dark:text-[#FAFCFF] justify-center mt-5">
              <h1 className="text-lg px-1 text-center">Create Your Profile</h1>
              <div className="dark:bg-[#100E28] bg-white px-3 xs:px-6 py-6 rounded-xl ">
                <section className="mt-5  sm:flex sm:flex-row gap-2 items-center justify-start flex-col">
                  <div className="flex justify-center">
                    {preview ? (
                      <Image
                        src={preview}
                        width={70}
                        height={70}
                        alt=""
                        className="rounded-full aspect-square bg-[#be6a6a6b] z-[10000]"
                      />
                    ) : (
                      <Icon
                        icon="flowbite:user-solid"
                        width={70}
                        height={70}
                        className="rounded-full bg-[#46455367] opacity-50"
                      />
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="border bg-[#322A44] cursor-pointer p-2 text-white rounded-full pl-4 pr-4  text-md flex items-center justify-center text-center mt-5 sm:mt-0"
                  >
                    <Icon icon="ph:plus-bold" width={14} />
                    <span>Upload new avatar</span>
                  </label>
                  <input
                    hidden
                    id="avatar"
                    type="file"
                    onChange={onFileChange}
                    className=""
                  />
                  <div className="flex justify-center items-center mt-5 sm:mt-0">
                    <button
                      onClick={removeAvatar}
                      className="border bg-[#322A44] cursor-pointer p-2 text-white rounded-full pl-4 pr-4  text-md flex items-center justify-center text-center w-full"
                    >
                      Remove
                    </button>
                  </div>
                </section>
                <section className="text-sm mt-5">
                  <InputInfo
                    title="Display Name"
                    placeholder="*Enter your Display Name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    isInvalid={isInvalid}
                    message="Input fullName"
                  />
                </section>
                <section className="text-sm mt-5">
                  <InputInfo
                    title="Email"
                    placeholder="*Enter your Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    isInvalid={isInvalid}
                    message="Input Email"
                  />
                </section>
                <div className="mt-5 flex justify-center items-center">
                  <button
                    onClick={handleSubmit}
                    className="border bg-[#322A44] cursor-pointer p-2 text-white rounded-full pl-4 pr-4  text-lg flex items-center justify-center text-center w-full sm:w-1/2"
                  >
                    {!isLoading ? (
                      <Icon icon="bx:cloud-upload" width={20} height={20} />
                    ) : (
                      <Icon
                        icon="line-md:uploading-loop"
                        width={20}
                        height={20}
                      />
                    )}
                    {user ? "UPDATE" : "CREATE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateProfileModal;
