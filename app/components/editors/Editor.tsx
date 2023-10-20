// Editor component

"use client";

// Imports
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { profanity } from "@2toad/profanity";
import { createId } from "@paralleldrive/cuid2";
import { supabase } from "@/app/lib/supabase/supabase";
import { decode } from "base64-arraybuffer";
import type { StoryProps } from "@/app/types/global.t";
import "react-quill/dist/quill.snow.css";
import Button from "@/app/components/buttons/Button";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Export default
const Editor: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || undefined;
  const longitude = Number(searchParams?.get("lng")) || undefined;
  const latitude = Number(searchParams?.get("lat")) || undefined;

  const [story, setStory] = useState<StoryProps>();

  const [randomId, setRandomId] = useState<string>();
  const [title, setTitle] = useState("A new vision");
  const [content, setContent] = useState("Start writing here...");
  const [imageUrl, setImageUrl] = useState("/images/placeholder.svg");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch story if editing existing
  useEffect(() => {
    // Fetches props for editing a pre-existing story
    const getStory = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/stories?id=${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setStory(data);
      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.imageUrl);
    };

    if (id !== undefined) {
      getStory();
    } else {
      setRandomId(createId());
    }
  }, [id]);

  // Check for profanity
  const checkProfanity = () => {
    if (profanity.exists(title) || profanity.exists(content)) {
      return true;
    } else {
      return false;
    }
  };

  // Generate image description from story content
  const getDescription = async (content: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/images/descriptions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  };

  // Upload image to supabase
  const uploadImage = async (image: string) => {
    const filename = `public/${
      id ? id : randomId
    }.webp?${new Date().getTime()}`;
    const { data, error } = await supabase.storage
      .from("story-covers")
      .upload(filename, decode(image), {
        contentType: "image/webp",
        upsert: true,
      });

    if (data) {
      const filepath = data.path;
      const imageUrl = supabase.storage
        .from("story-covers")
        .getPublicUrl(filepath);

      setImageUrl(imageUrl.data.publicUrl);
    } else {
      console.error(error);
    }
    setIsGenerating(false);
  };

  // Generate image from description
  const generateImage = async () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    const cleanString = content
      .replace(/(<([^>]+)>)/gi, "")
      .replaceAll("\\s+", " ")
      .trim();

    const description = await getDescription(cleanString);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/images`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: description,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to generate image");
    }

    const image = await res.json();

    uploadImage(image);
  };

  // Handle post request for a new story
  const handlePost = async () => {
    // Check for profanity
    if (checkProfanity()) {
      alert("Profanity detected");
      return;
    }

    if (imageUrl === "/images/placeholder.svg" || imageUrl === "") {
      alert("please generate a cover image first");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
      method: "POST",
      body: JSON.stringify({
        id: randomId,
        title: title,
        content: content,
        imageUrl: imageUrl,
        longitude: longitude,
        latitude: latitude,
        published: true,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save");
    }

    const data = await res.json();

    router.push(`/read/${data.id}`);
  };

  // Handle put request for an existing story
  const handlePut = async () => {
    // Check for profanity
    if (checkProfanity()) {
      throw new Error("Profanity detected");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
      method: "PUT",
      body: JSON.stringify({
        id: story!.id,
        title: title,
        content: content,
        imageUrl: imageUrl,
        published: true,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save");
    }

    const data = await res.json();

    router.push(`/read/${data.id}?v=${data.version}`);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Image
        className="absolute left-0 top-0 z-[-1] max-h-[100svh] w-full object-cover opacity-80 blur-2xl"
        src={imageUrl}
        width={1024}
        height={1024}
        alt={`Blurred background for ${title}`}
      />
      <article className="mt-[66vw] flex w-full flex-col items-center gap-[5em] rounded-t-2xl bg-white p-[7.5vh] sm:mt-[50vh]">
        <div className=" relative">
          <Image
            className="-mt-[50vw] aspect-auto w-[66vw] rounded-xl sm:-mt-[40vh] lg:w-prose"
            src={imageUrl}
            width={1024}
            height={1024}
            alt={`Cover image for ${title}`}
            priority
          />
          <div className="absolute -bottom-[2em] -right-[2em]">
            <AnimatedLink>
              <button
                onClick={generateImage}
                className="m-[1em] flex h-[3em] w-[3em] items-center justify-center rounded-full bg-gray shadow-md">
                <span
                  className={`material-symbols-rounded ${
                    isGenerating && "animate-spin"
                  }`}>
                  autorenew
                </span>
              </button>
            </AnimatedLink>
          </div>
        </div>
        <div className="flex w-full max-w-prose flex-col items-center gap-[5em]">
          <input
            className="flex w-full items-center justify-center border-b-2 border-dotted border-gray pb-[0.5em] text-center text-h1 font-bold outline-none focus:border-gray-dark"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="w-full"
          />
          <AnimatedLink>
            {story ? (
              <Button onClick={handlePut}>Update story</Button>
            ) : (
              <Button onClick={handlePost}>Save story</Button>
            )}
          </AnimatedLink>
        </div>
      </article>
    </div>
  );
};

export default Editor;
