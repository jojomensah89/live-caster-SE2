"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

export const livecasterFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be atleast 3 characters." }).trim(),
  description: z.string().min(4, { message: "description must be atleast 4 characters." }).trim(),
  credits: z.string().min(2, { message: "credits must be atleast 5 characters." }).trim(),
});
export type LiveCasterFormType = z.infer<typeof livecasterFormSchema>;
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";
const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [generatedFrameUrl, setgeneratedFrameUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<LiveCasterFormType>({
    resolver: zodResolver(livecasterFormSchema),
  });

  const processForm: SubmitHandler<LiveCasterFormType> = data => {
    console.log(data);
    reset();
  };

  const createFrame = () => {
    //refrences
    //https://docs.neynar.com/reference/publish-neynar-frame
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        //name: this is the frame name
        name: "test",
        //pages: number of pages on a frame
        pages: [
          {
            version: "vNext",
            //image; preview of what is to be shown on the frame
            image: {
              aspect_ratio: "1.91:1",
              //url: the image url
              url: "https://i.imgur.com/qo2AzBf.jpeg",
            },
            //input: if there is any input field
            input: { text: { enabled: false } },
            //uuuid: Unique identifier for the page.
            uuid: "asxaqw232",
            buttons: [{ action_type: "link", title: "greet", index: 1 }],
          },
        ],
      }),
    };

    fetch("https://api.neynar.com/v2/farcaster/frame", options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-3">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Livecaster</span>
          </h1>

          <form className="mt-8 py-12" onSubmit={handleSubmit(processForm)}>
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium leading-6 ">
                Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.title?.message && <p className="mt-2 text-sm text-red-400">{errors.title.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="description" className="block text-sm font-medium leading-6 ">
                Description
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="description"
                  {...register("description")}
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.description?.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="credits" className="block text-sm font-medium leading-6 ">
                  Credits
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="credits"
                    {...register("credits")}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.credits?.message && <p className="mt-2 text-sm text-red-400">{errors.credits.message}</p>}
                </div>
              </div>

              <button className="btn btn-sm btn-primary my-5">Launch Video</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
