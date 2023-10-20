// Map component

"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { StoryProps, TempMarkerProps } from "@/app/types/global.t";
import Button from "@/app/components/buttons/Button";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";
import { profanity } from "@2toad/profanity";
import { createId } from "@paralleldrive/cuid2";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/app/lib/supabase/supabase";

const Map = ({ stories }: { stories: StoryProps[] }) => {
  const ref = useRef(null);
  const router = useRouter();
  const mapCenter = useMemo(() => ({ lat: 51.4480315, lng: 5.4587816 }), []);
  const [map, setMap] = useState<GoogleMap>(undefined as unknown as GoogleMap);
  const [tempMarker, setTempMarker] = useState<TempMarkerProps>();
  const { data: session } = useSession();

  // New Story Variables
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState<string>("");
  const [assistance, setAssistance] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [randomId, setRandomId] = useState<string>(createId());

  // Topic variables
  const [direction, setDirection] = useState<string>("");
  const [directionValue, setDirectionValue] = useState<string>("");
  const [isGeneratingHelp, setIsGeneratingHelp] = useState(false);

  // Set the map options
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      tilt: 45,
      mapTypeId: "satellite",
      gestureHandling: "greedy",
    }),
    []
  );

  // Load the Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  // Create a new story
  const newStory = async (e: any) => {
    if (!session) return;

    // Set the temp marker
    setTempMarker({
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });

    // Pan to marker
    map.panTo({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    setIsCreating(true);
  };

  // Close the new story window
  const hancleClose = () => {
    setIsCreating(false);
    setTempMarker(undefined);
  };

  // Variants for animation
  const mapVariants = {
    full: { height: "100vh" },
    shared: { height: "40vh" },
  };
  const creationVariants = {
    hidden: { display: "none", marginTop: "0" },
    visible: { display: "block", marginTop: "-3em" },
  };

  // Check for profanity
  const checkProfanity = (story: string) => {
    if (profanity.exists(story)) {
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
    const filename = `public/${randomId}.webp?${new Date().getTime()}`;
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

      const generatedImage = imageUrl.data.publicUrl;

      return generatedImage;
    } else {
      console.error(error);
    }
  };

  // Generate image from description
  const generateImage = async (generatedStory: string) => {
    if (isGenerating) {
      return;
    }

    const description = await getDescription(generatedStory);

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

    const generatedImage = await uploadImage(image);

    return generatedImage;
  };

  // Upload the story
  const handleUpload = async (generatedStory: string) => {
    if (!session) return;

    if (checkProfanity(generatedStory)) {
      alert("Profanity detected");
      return;
    }

    setRandomId(createId());

    const generatedImage = await generateImage(generatedStory);

    const lines: string[] = [];

    generatedStory.split("\n").map((line) => {
      if (line.trim() !== "") {
        line = `<p>${line}</p>`;
        line = line.replace(/,/g, "&&]");
        lines.push(line);
      }
    });

    const htmlString = lines
      .toString()
      .replace(/,/g, "<p></p>")
      .replace(/&&]/g, ",");

    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
      method: "POST",
      body: JSON.stringify({
        id: randomId,
        title: "Title",
        content: htmlString,
        imageUrl: generatedImage,
        longitude: tempMarker?.longitude,
        latitude: tempMarker?.latitude,
        published: false,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save");
    }

    setIsGenerating(false);

    router.push(`/write?id=${randomId}`);
  };

  // Handle the story form
  const handleStoryForm = async (e: any) => {
    e.preventDefault();

    if (!session) return;
    if (isGenerating) return;

    if (topic === "" || assistance === "" || directionValue === "") {
      alert(
        "Please select a topic and assistance option before creating a story"
      );
    }

    setIsGenerating(true);

    if (assistance === "noAssistance") {
      router.push(
        `/write?lng=${tempMarker?.longitude}&lat=${tempMarker?.latitude}`
      );
    } else {
      if (assistance === "helpStart") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FETCH_URL}/ai/story-start`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: directionValue,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed fetching data");
        }

        const start = await res.json();

        handleUpload(start);
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FETCH_URL}/ai/story`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: directionValue,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed fetching data");
        }

        const story = await res.json();

        handleUpload(story);
      }
    }
  };

  // Handle the direction form
  const handleDirection = async (e: any) => {
    e.preventDefault();

    if (isGenerating) return;

    setIsGeneratingHelp(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/ai/direction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: direction }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed fetching data");
    }

    const directionValue = await res.json();

    setDirectionValue(directionValue);

    setIsGeneratingHelp(false);
  };

  // Handle assistance for topic
  const handleNeedHelp = async (e: any) => {
    e.preventDefault();

    if (isGenerating) return;

    setIsGeneratingHelp(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/ai/idea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed fetching data");
    }

    const idea = await res.json();

    setDirectionValue(idea);

    setIsGeneratingHelp(false);
  };

  // Get session
  useEffect(() => {
    console.log(session);
  }, [session]);

  // Clear inputs on change
  useEffect(() => {
    if (!isGenerating) {
      setDirection("");
      setDirectionValue("");
    }
  }, [topic, isGenerating]);

  return isLoaded ? (
    <main className="relative h-full w-full overflow-y-auto">
      <motion.div
        className="relative z-0 w-full"
        initial="full"
        animate={isCreating ? "shared" : "full"}
        variants={mapVariants}>
        <GoogleMap
          ref={ref}
          options={mapOptions}
          zoom={16}
          center={mapCenter}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onClick={(e) => newStory(e)}
          onLoad={(map) => setMap(map as unknown as GoogleMap)}>
          {stories?.map((marker) => (
            <MarkerF
              key={marker.id}
              position={{
                lat: Number(marker.latitude),
                lng: Number(marker.longitude),
              }}
              onClick={() => router.push(`/read/${marker.id}`)}
              icon={{
                url: `${marker.imageUrl}#custom_marker`,
                scaledSize: new window.google.maps.Size(65, 65),
              }}
            />
          ))}
          {tempMarker !== undefined && (
            <MarkerF
              position={{
                lat: Number(tempMarker.latitude),
                lng: Number(tempMarker.longitude),
              }}
              icon={{
                url: `/images/new-story.webp#custom_marker`,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}
        </GoogleMap>
        {!isCreating && (
          <div className="absolute bottom-[5em] left-0 flex w-full justify-center">
            <p className="px-[6vw] text-center text-h3 font-bold text-white drop-shadow-xl">
              {!session
                ? "Log in to start envisioning the future"
                : "Start envisioning the future by clicking on a location you want to envision"}
            </p>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        <motion.aside
          className="absolute z-[20] w-full rounded-t-[2em] bg-white p-[7.5vh]"
          variants={creationVariants}
          initial="hidden"
          animate={isCreating ? "visible" : "hidden"}>
          <div className="relative flex flex-col items-center gap-[5em]">
            {/* Close icon */}
            <div className="absolute left-0 top-0">
              <AnimatedLink className="absolute">
                <button onClick={() => hancleClose()}>
                  <span className="material-symbols-rounded">close</span>
                </button>
              </AnimatedLink>
            </div>

            {/* Info text */}
            <div className="mt-[7.5vh] w-prose">
              <p className="text-h3 font-semibold ">
                Stories can help us imagine the future. Using generative AI, we
                can jumpstart the creative process in future storytelling.
              </p>
            </div>

            <div
              className={`flex w-prose flex-col items-center gap-[2.5em] ${
                topic !== "" ? "gap-[5em]" : "gap-[2.5em]"
              }`}>
              {/* Topic bar */}
              <div className="flex flex-col items-center gap-[2.5em]">
                <h2 className="text-h2 font-bold">
                  Do you already have a topic in mind?
                </h2>
                <div className="flex justify-between gap-1 rounded-md bg-gray">
                  <Button
                    noY
                    onClick={() => setTopic("hasTopic")}
                    className={`${
                      topic === "hasTopic"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    Yes I do!
                  </Button>
                  <Button
                    noY
                    onClick={() => setTopic("hasDirection")}
                    className={`${
                      topic === "hasDirection"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    Help me choose
                  </Button>
                  <Button
                    noY
                    onClick={() => setTopic("needsHelp")}
                    className={`${
                      topic === "needsHelp"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    Choose for me
                  </Button>
                </div>
              </div>

              {/* Topic pane */}
              <div className="-mt-[1em] w-full">
                {topic === "hasTopic" ? (
                  <div className="mb-[2.5em] flex w-full flex-col items-center justify-center gap-[2.5em]">
                    <div className="flex w-full items-center justify-between gap-[1em]">
                      <input
                        className="w-full rounded-md border border-gray p-[1em] focus:border-gray-dark"
                        value={directionValue}
                        onChange={(e) => setDirectionValue(e.target.value)}
                        placeholder="Fill in a topic for your vision for the future"
                        name="direction"
                      />
                    </div>
                  </div>
                ) : // Has direction
                topic === "hasDirection" ? (
                  <div className="mb-[2.5em] flex w-full flex-col items-center gap-[2.5em]">
                    <div className="flex w-full items-center justify-between gap-[1em]">
                      <input
                        className="w-full rounded-md border border-gray p-[1em] focus:!border-gray-dark"
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        placeholder="Describe a direction for your vision for the future"
                        name="direction"
                      />
                      <Button
                        className="flex h-[3em] w-[3em] items-center justify-center !rounded-full bg-gray-dark text-white"
                        onClick={(e) => handleDirection(e)}>
                        <span
                          className={`material-symbols-rounded ${
                            isGeneratingHelp && "animate-spin"
                          }`}>
                          {isGeneratingHelp ? "autorenew" : "send"}
                        </span>
                      </Button>
                    </div>
                    {directionValue !== "" && (
                      <div className="mb-[2.5em] flex w-full flex-col items-center rounded-md bg-gray p-[2em]">
                        {directionValue}
                      </div>
                    )}
                  </div>
                ) : // Needs help
                topic === "needsHelp" ? (
                  <div className="relative mb-[2.5em] flex w-full justify-center rounded-md bg-gray p-[2em]">
                    <p id="need-help" className="text-body">
                      {directionValue !== "" ? (
                        directionValue
                      ) : (
                        <em>Start generating an idea</em>
                      )}
                    </p>
                    <div className="absolute bottom-0 right-0 -m-[1em]">
                      <Button
                        className=" flex h-[3em] w-[3em] items-center justify-center !rounded-full bg-gray-dark text-white"
                        onClick={(e) => handleNeedHelp(e)}>
                        <span
                          className={`material-symbols-rounded ${
                            isGeneratingHelp && "animate-spin"
                          }`}>
                          autorenew
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Assistance bar */}
              <div className="flex flex-col items-center gap-[2.5em]">
                <h2 className="text-h2 font-bold">
                  Do you already have a topic in mind?
                </h2>
                <div className="flex justify-between gap-1 rounded-md bg-gray">
                  <Button
                    noY
                    onClick={() => setAssistance("noAssistance")}
                    className={`${
                      assistance === "noAssistance"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    No, robot
                  </Button>
                  <Button
                    noY
                    onClick={() => setAssistance("helpStart")}
                    className={`${
                      assistance === "helpStart"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    Help me get started
                  </Button>
                  <Button
                    noY
                    onClick={() => setAssistance("helpWrite")}
                    className={`${
                      assistance === "helpWrite"
                        ? "bg-gray-dark text-white"
                        : "bg-gray"
                    }`}>
                    Can you write it?
                  </Button>
                </div>
              </div>

              {/* Generate button */}
              <Button onClick={(e) => handleStoryForm(e)}>
                <div className="flex items-center gap-1">
                  Start writing
                  {isGenerating && (
                    <span className="material-symbols-rounded animate-spin">
                      autorenew
                    </span>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </main>
  ) : null;
};

export default Map;
