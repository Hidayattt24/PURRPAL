/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Sarah Anderson",
    username: "@sarah_cat_lover",
    body: "PurrPal has been a game-changer! The AI health detection caught my cat's illness early. Truly amazing!",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Mike Chen",
    username: "@mike_vet_tech",
    body: "As a vet tech, I'm impressed by the accuracy of PurrPal's health monitoring. It's helping so many cat owners!",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emma Wilson",
    username: "@emma_kitty",
    body: "The emergency care guide helped me save my cat during a critical situation. Every cat owner needs this!",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David Kumar",
    username: "@david_purrfect",
    body: "The daily care tips have made me a better cat parent. My cat is healthier and happier than ever!",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Martinez",
    username: "@lisa_cat_mom",
    body: "Found an amazing vet through PurrPal's locator. The community support is incredible too!",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "Tom Jackson",
    username: "@tom_cat_dad",
    body: "The AI-powered tips are spot-on! It's like having a cat expert in your pocket 24/7.",
    img: "https://avatar.vercel.sh/tom",
  },
  {
    name: "Hiroshi Tanaka",
    username: "@hiroshi_neko",
    body: "I live in a remote area and PurrPal’s offline access has been a lifesaver. Highly recommended!",
    img: "https://avatar.vercel.sh/hiroshi",
  },
  {
    name: "Sophia Liu",
    username: "@sophia_catqueen",
    body: "The daily care reminders are super helpful. I feel more confident caring for my cat now.",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Carlos Gutierrez",
    username: "@carlos_catdad",
    body: "Thanks to PurrPal’s vet locator, I found a great vet close to home. What a helpful feature!",
    img: "https://avatar.vercel.sh/carlos",
  },
  {
    name: "Aisha Mohammed",
    username: "@aisha_feline",
    body: "I love how the community shares real experiences. It feels like a supportive family for cat owners.",
    img: "https://avatar.vercel.sh/aisha",
  },
  {
    name: "Daniel Green",
    username: "@daniel_catcare",
    body: "The AI health scan is very impressive. Detected something I would have missed myself.",
    img: "https://avatar.vercel.sh/daniel",
  },
  {
    name: "Chloe Adams",
    username: "@chloe_meow",
    body: "The emergency guide is well-structured and easy to follow, even when you’re stressed.",
    img: "https://avatar.vercel.sh/chloe",
  },
  {
    name: "Noah Johnson",
    username: "@noah_furfriend",
    body: "Offline access works perfectly during trips with my cat. Super useful feature!",
    img: "https://avatar.vercel.sh/noah",
  },
  {
    name: "Isabella Rossi",
    username: "@bella_gattina",
    body: "Love the community tips! I learned so much from other cat lovers on PurrPal.",
    img: "https://avatar.vercel.sh/bella",
  },
  {
    name: "Ahmed Khan",
    username: "@ahmed_catdad",
    body: "PurrPal saved my cat’s life — the AI flagged symptoms early and I acted fast. Forever grateful.",
    img: "https://avatar.vercel.sh/ahmed",
  },
  {
    name: "Emily Clark",
    username: "@emily_paws",
    body: "I check PurrPal every morning for care tips. It has become part of my daily routine.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Victor Hugo",
    username: "@victor_catlife",
    body: "PurrPal gives me peace of mind, knowing I have vet-approved guidance at my fingertips.",
    img: "https://avatar.vercel.sh/victor",
  },
  {
    name: "Fatima Zahra",
    username: "@fatima_meow",
    body: "As a first-time cat owner, this app has been a blessing. I’ve learned so much!",
    img: "https://avatar.vercel.sh/fatima",
  },
  {
    name: "Oliver Smith",
    username: "@oliver_felinecare",
    body: "I love how PurrPal combines AI with real vet knowledge. It’s the future of pet care.",
    img: "https://avatar.vercel.sh/oliver",
  },
  {
    name: "Mei Lin",
    username: "@mei_neko",
    body: "PurrPal’s design is beautiful and easy to use. Everything is clear and helpful.",
    img: "https://avatar.vercel.sh/mei",
  },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-[280px] cursor-pointer overflow-hidden rounded-xl border p-4 mb-4",
        "border-[#FF823C]/10 bg-white hover:bg-orange-50/50",
        "shadow-sm hover:shadow-md transition-all"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-neutral-800 font-poppins">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-[#FF823C]">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-neutral-600 leading-relaxed">{body}</blockquote>
    </figure>
  );
};

export function TestimonialSection() {
  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-orange-50/30 to-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF823C] to-[#C54F0C] bg-clip-text text-transparent font-poppins">
          Loved by Cat Parents Worldwide
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Join thousands of happy cat owners who trust PurrPal for their feline friends' wellbeing
        </p>
      </div>

      <div className="relative flex h-[28rem] w-full flex-row items-center justify-center gap-6 overflow-hidden [perspective:400px]">
        <div
          className="flex flex-row items-center gap-6"
          style={{
            transform:
              "translateX(-50px) translateY(0px) translateZ(-100px) rotateX(15deg) rotateY(-8deg) rotateZ(15deg)",
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:35s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:40s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:30s]">
            {thirdRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:45s]">
            {fourthRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#fff] via-[#fff]/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fff] via-[#fff]/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#fff] via-[#fff]/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#fff] via-[#fff]/80 to-transparent"></div>
      </div>
    </section>
  );
} 