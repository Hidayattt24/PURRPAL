/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Sarah Anderson",
    username: "@sarah_cat_lover",
    body: "Fitur AI PurrPal sangat membantu! Berhasil mendeteksi masalah kesehatan kucing saya sebelum menjadi serius. Terima kasih PurrPal!",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Mike Chen",
    username: "@mike_vet_tech",
    body: "Sebagai teknisi veteriner, saya terkesan dengan akurasi deteksi kesehatan AI PurrPal. Sangat membantu pemilik kucing mengenali masalah lebih awal!",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emma Wilson",
    username: "@emma_kitty",
    body: "Chatbot-nya sangat responsif dan membantu! Saya mendapat saran yang berguna tentang perawatan kucing saya di tengah malam.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David Kumar",
    username: "@david_purrfect",
    body: "Komunitas di PurrPal luar biasa supportif. Saya belajar banyak dari berbagi pengalaman dengan sesama pecinta kucing!",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Martinez",
    username: "@lisa_cat_mom",
    body: "Fitur posting memudahkan saya berbagi momen spesial dengan kucing saya. Suka sekali bisa terhubung dengan komunitas yang memiliki passion sama!",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "Tom Jackson",
    username: "@tom_cat_dad",
    body: "AI-nya sangat akurat dalam mendeteksi perubahan kesehatan kucing saya. Jadi lebih tenang karena bisa monitoring kesehatannya.",
    img: "https://avatar.vercel.sh/tom",
  },
  {
    name: "Hiroshi Tanaka",
    username: "@hiroshi_neko",
    body: "Chatbot PurrPal memberikan saran yang sangat membantu untuk perawatan kucing pertama saya. Seperti punya dokter hewan pribadi!",
    img: "https://avatar.vercel.sh/hiroshi",
  },
  {
    name: "Sophia Liu",
    username: "@sophia_catqueen",
    body: "Suka banget bisa berbagi foto dan cerita tentang kucing saya di PurrPal. Komunitas yang sangat positif dan mendukung!",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Carlos Gutierrez",
    username: "@carlos_catdad",
    body: "AI health detection-nya membantu saya mengambil keputusan kapan harus ke dokter hewan. Fitur yang sangat berguna!",
    img: "https://avatar.vercel.sh/carlos",
  },
  {
    name: "Aisha Mohammed",
    username: "@aisha_feline",
    body: "Komunitas PurrPal memberikan banyak insight tentang perawatan kucing. Senang bisa berbagi dan belajar dari pengalaman orang lain.",
    img: "https://avatar.vercel.sh/aisha",
  },
  {
    name: "Daniel Green",
    username: "@daniel_catcare",
    body: "Deteksi AI sangat membantu mengenali masalah kesehatan sejak dini. Berkat PurrPal, kucing saya selalu terpantau kesehatannya.",
    img: "https://avatar.vercel.sh/daniel",
  },
  {
    name: "Chloe Adams",
    username: "@chloe_meow",
    body: "Chatbot-nya cepat dan akurat dalam memberikan saran. Sangat membantu untuk pertanyaan seputar perawatan kucing!",
    img: "https://avatar.vercel.sh/chloe",
  },
  {
    name: "Noah Johnson",
    username: "@noah_furfriend",
    body: "Fitur posting dan komunitas membuat saya merasa tidak sendiri dalam merawat kucing. Banyak tips bermanfaat yang dibagikan!",
    img: "https://avatar.vercel.sh/noah",
  },
  {
    name: "Isabella Rossi",
    username: "@bella_gattina",
    body: "Suka sekali dengan fitur AI yang bisa mendeteksi kesehatan kucing. Jadi lebih cepat tanggap kalau ada masalah.",
    img: "https://avatar.vercel.sh/bella",
  },
  {
    name: "Ahmed Khan",
    username: "@ahmed_catdad",
    body: "PurrPal membantu menyelamatkan kucing saya! AI-nya mendeteksi gejala awal penyakit yang serius. Sangat berterima kasih!",
    img: "https://avatar.vercel.sh/ahmed",
  },
  {
    name: "Emily Clark",
    username: "@emily_paws",
    body: "Chatbot PurrPal selalu siap membantu 24/7. Sangat menenangkan punya asisten yang selalu bisa diandalkan.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Victor Hugo",
    username: "@victor_catlife",
    body: "Kombinasi AI dan komunitas di PurrPal membuat perawatan kucing jadi lebih mudah. Platform yang sangat lengkap!",
    img: "https://avatar.vercel.sh/victor",
  },
  {
    name: "Fatima Zahra",
    username: "@fatima_meow",
    body: "Sebagai pemilik kucing pemula, PurrPal sangat membantu dengan fitur AI dan chatbot-nya. Jadi lebih percaya diri merawat kucing!",
    img: "https://avatar.vercel.sh/fatima",
  },
  {
    name: "Oliver Smith",
    username: "@oliver_felinecare",
    body: "Fitur posting memudahkan berbagi pengalaman dan mendapat masukan dari komunitas. Jadi lebih yakin dalam merawat kucing.",
    img: "https://avatar.vercel.sh/oliver",
  },
  {
    name: "Mei Lin",
    username: "@mei_neko",
    body: "Interface PurrPal sangat user-friendly. Mudah menggunakan semua fiturnya, dari AI detection sampai posting di komunitas!",
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
          Dicintai oleh Para Pemilik Kucing di Seluruh Dunia
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pemilik kucing yang mempercayakan PurrPal untuk kesejahteraan teman kucing mereka
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