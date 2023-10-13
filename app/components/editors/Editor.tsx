// Editor component

// Key features:
// - Rich text editing
// - Save to local storage
// - Undo/redo

"use client";

// Imports
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { supabase } from "@/app/lib/supabase/supabase";
import { decode } from "base64-arraybuffer";
import type { StoryProps } from "@/app/types/global.t";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Export default
const Editor: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;
  const longitude = Number(searchParams.get("lng")) || undefined;
  const latitude = Number(searchParams.get("lat")) || undefined;

  const [story, setStory] = useState<StoryProps>();

  const [randomId, setRandomId] = useState("");
  const [title, setTitle] = useState(story ? story.title : "Title");
  const [content, setContent] = useState(story ? story.content : "Content");
  const [imageUrl, setImageUrl] = useState(story ? story.imageUrl : "");

  // Fetches props for editing a pre-existing story
  const getStory = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories?id=${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    setStory(data);
  };

  // Upload image to supabase
  const uploadImage = async (image: string) => {
    const filename = `public/test.webp`;
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
  };

  // Generate image from description
  const generateImage = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/images`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "A future city",
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
      method: "POST",
      body: JSON.stringify({
        id: randomId,
        title: title,
        content: content,
        imageUrl: imageUrl,
        longitude: longitude,
        latitude: latitude,
        published: false,
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

    router.push(`/read/${data.id}`);
  };

  // Fetch story if editing existing
  if (id !== undefined) {
    getStory();
  } else {
    if (randomId === "") {
      setRandomId(createId());
    }
  }

  return (
    <div className="flex flex-col w-[50vw]">
      <button onClick={generateImage}>Generate image</button>
      <input
        type="text"
        value={title as string}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill
        theme="snow"
        value={content as string}
        onChange={setContent}
      />
      {story ? (
        <button onClick={handlePut}>Update</button>
      ) : (
        <button onClick={handlePost}>Save</button>
      )}
      {imageUrl !== "" && (
        <Image
          src={imageUrl.toString()}
          width={1024}
          height={1024}
          alt="image"
        />
      )}
    </div>
  );
};

export default Editor;
