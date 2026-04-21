"use client";

import React, { useState, useEffect } from "react";
import { Artwork, FilterOptions } from "@/lib/types";
import { fetchArtworks } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import Link from "next/link";

export default function Marketplace() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    rating: 0,
    artist: "",
    category: "",
    searchTerm: "",
  });
  const { addToCart } = useCart();

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      const data = await fetchArtworks();
      setArtworks(data);
    } catch (error) {
      console.error("Failed to load artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch = art.title
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesPrice =
      art.price >= filters.priceRange[0] && art.price <= filters.priceRange[1];
    const matchesRating =
      !filters.rating || (art.rating && art.rating >= filters.rating);
    const matchesArtist = !filters.artist || art.artist === filters.artist;
    const matchesCategory =
      !filters.category || art.category === filters.category;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesArtist &&
      matchesCategory
    );
  });

  const artists = Array.from(new Set(artworks.map((art) => art.artist)));
  const categories = Array.from(new Set(artworks.map((art) => art.category).filter(Boolean)));

  if (loading) {
    return <div className="p-6 text-center">Loading marketplace...</div>;
  }

  return (
    <div className="flex gap-6 p-6">
      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        artists={artists}
        categories={categories}
      />

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Local Canvas Marketplace</h1>
        <p className="text-gray-600 mb-4">
          Showing {filteredArtworks.length} of {artworks.length} artworks
        </p>

        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No artworks match your filters. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredArtworks.map((art) => (
              <Card key={art.id} className="rounded-2xl shadow-lg hover:shadow-xl transition">
                <Link href={`/artwork/${art.id}`}> 
                  <img
                    src={art.image}
                    alt={art.title}
                    className="rounded-t-2xl h-48 w-full object-cover cursor-pointer hover:opacity-90"
                  />
                </Link>

                <CardContent className="p-4">
                  <Link href={`/artwork/${art.id}`}> 
                    <h2 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                      {art.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-gray-500">by {art.artist}</p>

                  {art.rating && (
                    <p className="text-sm text-yellow-500 my-1">
                      {art.rating} ★ ({art.reviews?.length || 0} reviews)
                    </p>
                  )}

                  {art.category && (
                    <p className="text-xs text-gray-400 mb-2">{art.category}</p>
                  )}

                  <p className="mt-2 font-bold text-lg">${art.price}</p>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        addToCart(art, 1);
                        alert(`${art.title} added to cart!`);
                      }}
                      disabled={!art.inStock}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {art.inStock ? "Buy Now" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      ❤️
                    </Button>
                  </div>

                  <Link href={`/artwork/${art.id}`}> 
                    <Button variant="outline" className="w-full mt-2">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
