import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = parseInt(searchParams.get("from") || "0", 10);
  const to = parseInt(searchParams.get("to") || "7", 10);
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const beds = searchParams.get("beds");
  const baths = searchParams.get("baths");
  const propertyType = searchParams.get("propertyType");
  const amenities = searchParams.get("amenities");
  const type = searchParams.get("type");
  const is_featured = searchParams.get("is_featured");

  const supabase = await createClient();
  let query = supabase.from("properties").select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
  }
  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice));
  }
  if (beds) {
    query = query.gte("beds", parseInt(beds, 10));
  }
  if (baths) {
    query = query.gte("baths", parseFloat(baths));
  }
  if (propertyType && propertyType !== "Any Type") {
    query = query.ilike("title", `%${propertyType}%`);
  }
  if (amenities) {
    const amenitiesList = amenities.split(",");
    query = query.contains("amenities", amenitiesList);
  }
  if (type) {
    query = query.eq("type", type);
  }
  if (is_featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data, totalCount: count });
}
