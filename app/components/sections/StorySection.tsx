// StorySection component

import Image from "next/image";
import type { StorySectionProps } from "@/app/types/global.t";

const StorySection: React.FC<StorySectionProps> = ({
  title,
  content,
  imageUrl,
  user,
}) => {
  return (
    <section id="story">
      <Image
        className="absolute left-0 top-0 z-[-1] max-h-[60vh] w-full object-cover opacity-80 blur-2xl"
        src={imageUrl}
        width={1024}
        height={1024}
        alt={`Blurred background for ${title}`}
      />
      <article className="mt-[66vw] flex flex-col items-center gap-[5em] rounded-t-2xl bg-white p-[7.5vh] sm:mt-[50vh]">
        <Image
          className="-mt-[50vw] aspect-auto w-[66vw] rounded-xl sm:-mt-[40vh] lg:w-prose"
          src={imageUrl}
          width={1024}
          height={1024}
          alt={`Cover image for ${title}`}
          priority
        />
        <div className="flex flex-col gap-[2.5em]">
          <div className="flex flex-col items-center gap-[2.5vh]">
            <h1 className="text-h1 font-bold">{title}</h1>
            <p className="text-body italic text-gray-dark">By {user.name}</p>
          </div>
          <div
            id="story-content"
            className="max-w-prose text-body"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </section>
  );
};

export default StorySection;
