// Editor component

// Key features:
// - Rich text editing

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
import AnimatedLink from "../buttons/AnimatedLink";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Export default
const Editor: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;
  const longitude = Number(searchParams.get("lng")) || undefined;
  const latitude = Number(searchParams.get("lat")) || undefined;

  const [story, setStory] = useState<StoryProps>();

  const [randomId, setRandomId] = useState<string>();
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("Content");
  const [imageUrl, setImageUrl] = useState("");
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
      if (!randomId) {
        setRandomId(createId());
      }
    }
  }, [id, randomId]);

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

    const cleanString = content
      .replace(/(<([^>]+)>)/gi, "")
      .replaceAll("\\s+", " ")
      .trim();

    const description = await getDescription(cleanString);

    setIsGenerating(true);
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
      method: "POST",
      body: JSON.stringify({
        id: randomId,
        title: title,
        content: content,
        imageUrl: imageUrl,
        longitude: longitude,
        latitude: latitude,
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
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save");
    }

    const data = await res.json();

    router.push(`/read/${data.id}?v=${data.version}`);
  };

  return (
    <div className="w-full flex flex-col items-center p-[10vw]">
      <div className="relative w-prose flex flex-col items-center gap-[2.5em]">
        <div className="absolute top-0 left-0">
          <AnimatedLink>
            <Link href={`/read/${id}`}>
              <span className="material-symbols-rounded">arrow_back</span>
            </Link>
          </AnimatedLink>
        </div>
        <div className=" relative w-1/2">
          {imageUrl !== "" ? (
            <Image
              className="rounded-xl"
              src={imageUrl}
              width={1024}
              height={1024}
              alt="image"
            />
          ) : (
            <div className="bg-gray aspect-square rounded-xl"></div>
          )}
          <div className="absolute -bottom-[2em] -right-[2em]">
            <AnimatedLink>
              <button
                onClick={generateImage}
                className="m-[1em] w-[3em] h-[3em] bg-gray rounded-full flex items-center justify-center shadow-md">
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
        <input
          className="border-b-2 border-black text-h1 font-bold pb-[0.5em] border-dotted flex items-center justify-center w-full text-center outline-none"
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
            <button
              className="bg-gray rounded-md py-[0.25em] px-[0.45em]"
              onClick={handlePut}>
              Update story
            </button>
          ) : (
            <button className="" onClick={handlePost}>
              Save story
            </button>
          )}
        </AnimatedLink>
      </div>
    </div>
  );
};

export default Editor;
