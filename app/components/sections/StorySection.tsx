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
      <h1>{title}</h1>
      <p>By {user.name}</p>
      <Image
        src={imageUrl}
        width={1024}
        height={1024}
        alt={`Story cover for ${title}`}
        priority
      />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export default StorySection;
