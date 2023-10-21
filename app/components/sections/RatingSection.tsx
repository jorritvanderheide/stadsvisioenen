// RatingSection component

"use client";

import { useEffect, useState } from "react";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";
import { prominent } from "color.js";

const RatingSection = ({ id, imageUrl }: { id: string; imageUrl: string }) => {
  const [userRating, setUserRating] = useState({} as Record<string, number>);
  const [color, setColor] = useState<string>(
    `#${Math.floor(Math.random() * 16777215).toString(16)}` // Random hex color
  );

  // Fetches user rating
  useEffect(() => {
    const getRating = async () => {
      const res = await fetch(`/api/stories/ratings?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const { ratingId, ratingValue } = await res.json();

      setUserRating({ ratingId, ratingValue });
    };

    // Fetch accent color for story
    const getAccentColor = async () => {
      setColor(
        (await prominent(imageUrl, { amount: 1, format: "hex" })) as string
      );
    };

    getRating();
    getAccentColor();
  }, [id, imageUrl]);

  // Change color of stars
  useEffect(() => {
    const stars = document.querySelectorAll("#rating button");
    stars.forEach((star, index) => {
      if (index < (userRating.ratingValue ?? 0)) {
        (star as HTMLElement).style.color = color;
      } else {
        (star as HTMLElement).style.color = "#D9D9D9";
      }
    });
  }, [userRating, color]);

  // Update rating
  const rateStory = async (rating: number) => {
    if (userRating.ratingValue !== 0) {
      const res = await fetch(
        `/api/stories/ratings?id=${userRating.ratingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setUserRating({
        ratingId: userRating.ratingId,
        ratingValue: data.rating,
      });
    } else {
      const res = await fetch(`/api/stories/ratings?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setUserRating({
        ratingId: userRating.ratingId,
        ratingValue: data.rating,
      });
    }
  };

  return (
    <>
      <section id="rating">
        <div className="flex w-full items-center justify-center border-t-[1px] border-gray bg-white p-[7.5vh]">
          <div className="flex flex-col items-center gap-[2.5em]">
            <h2 className="text-h2 font-bold">Rate this story</h2>
            <div className="flex">
              {[...Array(5)].map((e, index: number) => {
                index += 1;
                return (
                  <AnimatedLink key={index}>
                    <button
                      type={"button"}
                      onClick={() => rateStory(index)}
                      className={
                        index > (userRating.ratingValue ?? 0) ? "text-gray" : ""
                      }>
                      <span
                        key={index}
                        className="material-symbols-rounded filled">
                        star
                      </span>
                    </button>
                  </AnimatedLink>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RatingSection;
