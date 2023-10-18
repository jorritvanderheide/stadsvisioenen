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
        className="absolute top-0 left-0 blur-2xl opacity-80 z-[-1] w-full object-cover"
        src={imageUrl}
        width={1024}
        height={1024}
        alt={`Blurred background for ${title}`}
      />
      <article className="bg-white flex flex-col items-center gap-[5em] mt-[55vh] rounded-t-2xl p-[7.5vh]">
        <Image
          className="w-prose aspect-auto -mt-prose rounded-xl"
          src={imageUrl}
          width={1024}
          height={1024}
          alt={`Cover image for ${title}`}
          priority
        />
        <div className="flex flex-col gap-[2.5em]">
          <div className="flex flex-col gap-[2.5vh] items-center">
            <h1 className="font-bold text-h1">{title}</h1>
            <p className="text-gray text-body">By {user.name}</p>
          </div>
          <div
            id="story-content"
            className="w-prose text-body"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </section>
  );
};

export default StorySection;
