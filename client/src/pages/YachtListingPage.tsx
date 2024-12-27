import { useState } from "react";
import { Link } from "wouter";
import { useYachts } from "../hooks/use-yachts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function YachtListingPage() {
  const { data: yachts, isLoading } = useYachts();
  const [filters, setFilters] = useState({
    search: "",
    priceRange: "",
  });

  const filteredYachts = yachts?.filter((yacht) => {
    const matchesSearch = yacht.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesPrice =
      !filters.priceRange ||
      (filters.priceRange === "low" && yacht.pricePerDay <= 5000) ||
      (filters.priceRange === "medium" &&
        yacht.pricePerDay > 5000 &&
        yacht.pricePerDay <= 10000) ||
      (filters.priceRange === "high" && yacht.pricePerDay > 10000);

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary">Etoile Yachts</a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search yachts..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="price-range">Price Range</Label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) =>
                setFilters({ ...filters, priceRange: value })
              }
            >
              <SelectTrigger id="price-range">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                <SelectItem value="low">Up to $5,000/day</SelectItem>
                <SelectItem value="medium">$5,000 - $10,000/day</SelectItem>
                <SelectItem value="high">$10,000+/day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Yacht Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredYachts?.map((yacht) => (
              <Card key={yacht.id} className="overflow-hidden">
                <img
                  src={yacht.imageUrls[0]}
                  alt={yacht.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{yacht.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {yacht.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Price per day</p>
                      <p className="text-lg font-semibold">
                        ${yacht.pricePerDay.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Length</p>
                      <p className="text-lg">{yacht.length}m</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/yachts/${yacht.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
