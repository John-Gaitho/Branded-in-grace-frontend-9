import { useEffect, useState } from "react";
import {
  Search,
  GlassWater,
  Droplet,
  Thermometer,
  Coffee,
  Shirt,
  Layers,
  Key,
  Image,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { debounce } from "@/lib/utils";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { productsAPI } from "@/integrations/api/client";


export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  // ✅ Categories with icons + colors
  const categories = [
    {
      id: "glass-tumblers",
      name: "Glass Tumblers",
      icon: GlassWater,
      color: "text-sky-500 bg-sky-50 hover:bg-sky-100",
    },
    {
      id: "water-bottles",
      name: "Water Bottles",
      icon: Droplet,
      color: "text-blue-500 bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "thermal-flasks",
      name: "Thermal Flasks",
      icon: Thermometer,
      color: "text-amber-600 bg-amber-50 hover:bg-amber-100",
    },
    {
      id: "mugs",
      name: "Mugs",
      icon: Coffee,
      color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
    },
    {
      id: "tshirts",
      name: "T-Shirts",
      icon: Shirt,
      color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    },
    {
      id: "hoodies",
      name: "Hoodies",
      icon: Shirt,
      color: "text-violet-600 bg-violet-50 hover:bg-violet-100",
    },
    {
      id: "sweatshirts",
      name: "Sweatshirts",
      icon: Layers,
      color: "text-pink-600 bg-pink-50 hover:bg-pink-100",
    },
    {
      id: "keychains",
      name: "Keychains",
      icon: Key,
      color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
    },
    {
      id: "posters-cards",
      name: "Posters & Cards",
      icon: Image,
      color: "text-red-500 bg-red-50 hover:bg-red-100",
    },
  ];

  // ✅ Fetch products with clean format
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.list();
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Debounced search
  const debouncedSearch = debounce((term: string) => {
    filterAndSortProducts(term, sortBy, filterBy);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    filterAndSortProducts(searchTerm, sortBy, filterBy);
  }, [sortBy, filterBy, products]);

  // ✅ Filtering + sorting
  const filterAndSortProducts = (
    search: string,
    sort: string,
    filter: string
  ) => {
    if (!Array.isArray(products)) return;

    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all") {
      if (filter === "featured") {
        filtered = filtered.filter((p) => p.is_featured);
      } else if (filter === "in-stock") {
        filtered = filtered.filter((p) => (p.stock_quantity || 0) > 0);
      } else {
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase().replace(/\s+/g, "-") === filter
        );
      }
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-muted-foreground text-lg">
            Discover the perfect product for every moment
          </p>
        </div>

        {/* Toolbar: Search + Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          {/* Search bar */}
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <aside className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = filterBy === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterBy(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition ${
                      isActive
                        ? `${cat.color} border-current font-semibold`
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    {cat.name}
                  </button>
                );
              })}
              {/* Reset Button */}
              <button
                onClick={() => setFilterBy("all")}
                className={`p-3 rounded-lg border text-sm transition ${
                  filterBy === "all"
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Products
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card
                    key={i}
                    className="grace-card h-48 sm:h-64 md:h-80 animate-pulse bg-muted"
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} compact />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="grace-card p-12 text-center">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterBy("all");
                      setSortBy("name");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
