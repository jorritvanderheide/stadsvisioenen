// RatingSection component

"use client";

import { useEffect, useState } from "react";

const RatingSection = ({ id }: { id: string }) => {
  const [userRating, setUserRating] = useState<number>();

  // Fetches user rating
  useEffect(() => {
    const getRating = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/ratings?id=${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setUserRating(data);
    };

    getRating();
  }, [id]);

  // Update rating
  const rateStory = async (rating: number) => {
    if (userRating !== 0) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/ratings?id=${id}`,
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

      setUserRating(data.rating);
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/ratings?id=${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setUserRating(data.rating);
    }
  };

  return (
    <>
      <section id="rating">
        <h2>Rate this story</h2>
        {[...Array(5)].map((e, index: number) => {
          index += 1;
          return (
            <button
              type={"button"}
              onClick={() => rateStory(index)}
              className={
                index > (userRating ?? 0) ? "text-gray-200" : "text-red-500"
              }
              key={index}>
              <span key={index} className="material-symbols-rounded filled">
                star
              </span>
            </button>
          );
        })}
      </section>
    </>
  );
};

export default RatingSection;
