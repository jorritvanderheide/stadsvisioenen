// Map component

"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { StoryProps, TempMarkerProps } from "@/app/types/global.t";
import Button from "@/app/components/buttons/Button";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";
import { profanity } from "@2toad/profanity";
import { createId } from "@paralleldrive/cuid2";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/app/lib/supabase/supabase";

import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const Map = ({ stories }: { stories: StoryProps[] }) => {
  const ref = useRef(null);
  const router = useRouter();
  const mapCenter = useMemo(() => ({ lat: 51.4480315, lng: 5.4587816 }), []);
  const [map, setMap] = useState<GoogleMap>(undefined as unknown as GoogleMap);
  const [tempMarker, setTempMarker] = useState<TempMarkerProps>();
  const { data: session } = useSession();
  const [logger, setLogger] = useState<string>("");

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

  // OpenAI
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

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
    full: { height: "100svh" },
    shared: { height: "40svh" },
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
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [
        {
          role: "user",
          content: `Write a short alt-text style description for an image that could be the cover of this story: ${content}.`,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    const textResponse = new StreamingTextResponse(stream);

    const description = await textResponse.text();

    return description;
  };

  // Upload image to supabase
  const uploadImage = async (image: string) => {
    setLogger("Uploading image");

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
    setLogger("Generating image description");

    const description = await getDescription(generatedStory);

    setLogger("Generating image");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories/images`,
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

    setLogger("Checking content");

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

    setLogger("Uploading story");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories`,
      {
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
      }
    );

    setIsGenerating(false);

    router.push(`/write?id=${randomId}`);
  };

  // Handle the story form
  const handleStoryForm = async (e: any) => {
    e.preventDefault();

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
      setLogger("Generating story");

      if (assistance === "helpStart") {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          stream: true,
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Write a beginning of a story based on these criteria:
              Extremely provocative and immersive.
              About improvement to the build environment or city for the future.
              The story should be about ${topic}.
              Make it probable, and not too futuristic.
              Leave the end open for others to continue, so keep it short.
              `,
            },
          ],
        });

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);

        const textResponse = new StreamingTextResponse(stream);

        const start = await textResponse.text();

        handleUpload(start);
      } else {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          stream: true,
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `Write a beginning of a story based on these criteria:
              Extremely provocative and immersive.
              About improvement to the build environment or city for the future.
              The story should be about ${directionValue}.
              Make it probable, and not too futuristic. 
              `,
            },
          ],
        });

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);

        const textResponse = new StreamingTextResponse(stream);

        const story = await textResponse.text();

        handleUpload(story);
      }
    }
  };

  // Handle the direction form
  const handleDirection = async (e: any) => {
    e.preventDefault();

    if (isGenerating) return;

    setIsGeneratingHelp(true);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: `Write a one-sentence idea to for a short story based on these criteria:
          It should be speculative fiction, but not about technology.
          It should be about ${direction}.
          It is meant to be a fun way to discuss the possbile future of the city in the social domain.
          `,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    const textResponse = new StreamingTextResponse(stream);

    const directionValue = await textResponse.text();

    setDirectionValue(directionValue);

    setIsGeneratingHelp(false);
  };

  // Handle assistance for topic
  const handleNeedHelp = async (e: any) => {
    e.preventDefault();

    if (isGenerating) return;

    setIsGeneratingHelp(true);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: `Write a one-sentence idea to for a short story based on these criteria:
          It should be speculative fiction, but not about technology.
          It should be about one of the following topics: Nutrition and Basic Medical Care, Water and Sanitation, Shelter, Personal Security, Access to Basic Knowledge, Access to Information and 
          Communication, Health and Wellness, Environmental Quality, Personal Rights, Personal Freedom and Choice, Tolerance and Inclusion, Access to Advanced Education.
          Don't mention these domains specifically, but situate the story in an everyday situtation in one of them.
          It is meant to be a fun way to discuss the possbile future of the city in the social domain..
          `,
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    const textResponse = new StreamingTextResponse(stream);

    const idea = await textResponse.text();

    setDirectionValue(idea);

    setIsGeneratingHelp(false);
  };

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
                : "Start envisioning the future by clicking on a location"}
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
          <div className="relative flex w-full flex-col items-center gap-[5em]">
            {/* Close icon */}
            <div className="absolute left-0 top-0">
              <AnimatedLink className="absolute">
                <button onClick={() => hancleClose()}>
                  <span className="material-symbols-rounded">close</span>
                </button>
              </AnimatedLink>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-[5em]">
              {/* Info text */}
              <div className="mt-[7.5vh] max-w-prose">
                <p className="text-h3 font-semibold">
                  With the help of artificial intelligence, you can help us
                  create a more diverse and inclusive dialogue about urban
                  development.
                </p>
              </div>

              <div
                className={`flex w-full max-w-prose flex-col items-center gap-[2.5em] ${
                  topic !== "" ? "gap-[5em]" : "gap-[2.5em]"
                }`}>
                {/* Topic bar */}
                <div className="flex flex-col items-center gap-[2.5em]">
                  <h2 className="text-h2 font-bold">
                    Do you already have a topic in mind?
                  </h2>
                  <div className="flex justify-between gap-1 rounded-md bg-gray text-[min(3vw,0.9rem)] md:text-body">
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
                <div className="flex flex-col items-center gap-[2.5em] text-[min(3vw,0.9rem)] md:text-body">
                  <h2 className="text-h2 font-bold">
                    Do you want me to help you write?
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

                <div className="flex flex-col items-center gap-[2.5vh]">
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
                  <p className="animate-pulse text-body italic">
                    {logger !== "" && logger}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </main>
  ) : null;
};

export default Map;
