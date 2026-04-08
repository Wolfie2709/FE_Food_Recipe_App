import React from "react";

type Creator = { name: string; image: string };
type Recipe = { title: string; author: string; image: string; time?: string };

const creators: Creator[] = [
  { name: "Troyan Smith", image: "/Unsplashgewnwhggxls.png" },
  { name: "James Wolden", image: "/Unsplashwnolnjo7ts8.png" },
  { name: "Niki Samantha", image: "/Unsplashsfdbi7p47xe.png" },
  { name: "Roberta Anny", image: "/Unsplashij24uq1smwm.png" },
];

const recentRecipes: Recipe[] = [
  { title: "Indonesian chicken burger", author: "Adrianna Curl", image: "/Image7.png" },
  { title: "Home made cute pancake", author: "James Wolden", image: "/Image9.png" },
  { title: "Seafood fried rice", author: "Roberta Anny", image: "/Image10.png" },
];

const trendingRecipes: Recipe[] = [
  { title: "How to make sushi at home", author: "Niki Samantha", image: "/Image4.png" },
  { title: "How to make sandwich", author: "Troyan Smith", image: "/Image6.png" },
];

function CreatorCard({ name, image }: Creator) {
  return (
    <div className="flex flex-col items-center">
      <img src={image} alt={name} className="rounded-full w-20 h-20 object-cover" />
      <p className="text-gray-800 font-semibold text-xs mt-2 text-center">{name}</p>
    </div>
  );
}

function RecipeCard({ title, author, image, time }: Recipe) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-40">
      <img src={image} alt={title} className="w-full h-24 object-cover" />
      <div className="p-2">
        <p className="text-gray-800 font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs">By {author}</p>
        {time && <p className="text-gray-700 text-xs font-medium">⏱ {time}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Popular creators */}
      <section className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Popular creators</h2>
          <button className="text-red-500 text-sm font-semibold">See all</button>
        </div>
        <div className="flex gap-4">
          {creators.map((c) => (
            <CreatorCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      {/* Recent recipes */}
      <section className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent recipes</h2>
          <button className="text-red-500 text-sm font-semibold">See all</button>
        </div>
        <div className="flex gap-4">
          {recentRecipes.map((r) => (
            <RecipeCard key={r.title} {...r} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Popular categories</h2>
        <div className="flex gap-2 flex-wrap">
          {["Salad", "Breakfast", "Appetizer", "Noodle", "Lunch"].map((cat) => (
            <span
              key={cat}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                cat === "Breakfast" ? "bg-red-500 text-white" : "bg-white text-red-400 border"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Trending now 🔥</h2>
          <button className="text-red-500 text-sm font-semibold">See all</button>
        </div>
        <div className="flex gap-4">
          {trendingRecipes.map((r) => (
            <RecipeCard key={r.title} {...r} />
          ))}
        </div>
      </section>

      {/* Search bar */}
      <section className="p-5">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white shadow">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search recipes"
            className="flex-1 text-sm text-gray-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Hero tagline */}
      <section className="p-5">
        <h2 className="text-2xl font-semibold text-gray-800">Find best recipes for cooking</h2>
      </section>
    </div>
  );
}
