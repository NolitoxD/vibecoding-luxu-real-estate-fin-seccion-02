"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Property } from "@/types/property";
import { createClient } from "@/lib/supabase/client";
import { createProperty, updateProperty } from "@/lib/actions/admin";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

type PropertyFormProps = {
  property?: Property;
};

// Available amenities based on the HTML design
const AMENITIES_LIST = [
  "Swimming Pool",
  "Garden",
  "Air Conditioning",
  "Smart Home",
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z
    .number({ message: "Price must be a number" })
    .min(1, "Price must be greater than 0"),
  status: z.enum(["active", "pending", "sold"]),
  type: z.enum(["sale", "rent"]),
  description: z.string().optional(),
  sqft: z.number({ message: "Area must be a number" }).min(0).optional(),
  beds: z.number().min(0).optional(),
  baths: z.number().min(0).optional(),
  garage: z.number().min(0).optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      price: property?.price || 0,
      status: (property?.status as "active" | "pending" | "sold") || "active",
      type: (property?.type as "sale" | "rent") || "sale",
      description: property?.description || "",
      sqft: property?.sqft || 0,
      beds: property?.beds || 0,
      baths: property?.baths || 0,
      garage: property?.garage || 0,
      location: property?.location || "",
    },
  });

  const locationWatch = watch("location") ?? "";
  const bedsWatch = watch("beds") ?? 0;
  const bathsWatch = watch("baths") ?? 0;
  const garageWatch = watch("garage") ?? 0;

  const [amenities, setAmenities] = useState<string[]>(
    property?.amenities || [],
  );

  // Images already uploaded
  const [existingImages, setExistingImages] = useState<string[]>(
    property?.images || [],
  );

  // New files to upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // File previews
  const [previews, setPreviews] = useState<string[]>([]);

  const handleRemoveExistingImage = (img: string) => {
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleRemovePreview = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitError("");

    startTransition(async () => {
      try {
        const uploadedImageUrls: string[] = [];

        if (imageFiles.length > 0) {
          const supabase = createClient();
          for (const file of imageFiles) {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            const { error: uploadError } = await supabase.storage
              .from("properties")
              .upload(fileName, file);

            if (uploadError) {
              console.error("Upload Error:", uploadError);
              throw new Error(`Failed to upload ${file.name}`);
            }

            const { data: publicData } = supabase.storage
              .from("properties")
              .getPublicUrl(fileName);

            uploadedImageUrls.push(publicData.publicUrl);
          }
        }

        const finalImages = [...existingImages, ...uploadedImageUrls];

        const dataToSave = {
          ...data,
          amenities,
          images: finalImages,
        };

        if (property) {
          await updateProperty(property.id, dataToSave);
        } else {
          await createProperty(dataToSave);
        }

        router.push("/admin");
      } catch (err: unknown) {
        setSubmitError(
          err instanceof Error ? err.message : "Error saving property",
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
    >
      <div className="xl:col-span-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label
                className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                htmlFor="title"
              >
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className={`w-full text-base px-4 py-2.5 rounded-md border text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro ${errors.title ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}
                placeholder="e.g. Modern Penthouse with Ocean View"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                  htmlFor="price"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className={`w-full pl-7 pr-4 py-2.5 rounded-md border text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro ${errors.price ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending Sale</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                  htmlFor="type"
                >
                  Property Type
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">Description</h2>
          </div>
          <div className="p-8">
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]"
              placeholder="Describe the property features, neighborhood, and unique selling points..."
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">
              JPG, PNG, WEBP
            </span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
              <input
                title="Upload images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic font-sf-pro">
                    Click or drag images here
                  </p>
                  <p className="text-xs text-gray-400 font-sf-pro">
                    Max file size 5MB per image
                  </p>
                </div>
              </div>
            </div>

            {(existingImages.length > 0 || previews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {existingImages.map((img, i) => (
                  <div
                    key={`exist-${i}`}
                    className="aspect-square rounded-lg overflow-hidden relative group shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt="Property image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img)}
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {previews.map((preview, i) => (
                  <div
                    key={`prev-${i}`}
                    className="aspect-square rounded-lg overflow-hidden relative group shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="New upload preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => handleRemovePreview(i)}
                        className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro"
                htmlFor="location"
              >
                Address
              </label>
              <input
                id="location"
                type="text"
                {...register("location")}
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro"
                placeholder="Street Address, City, Zip"
              />
            </div>
            <PropertyMap address={locationWatch} />
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="group">
              <label
                className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block"
                htmlFor="area"
              >
                Area (sqft)
              </label>
              <input
                id="area"
                type="number"
                {...register("sqft", { valueAsNumber: true })}
                className={`w-full text-left px-3 py-2 rounded border bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm ${errors.sqft ? "border-red-500" : "border-gray-200"}`}
                placeholder="0"
              />
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    bed
                  </span>{" "}
                  Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setValue("beds", Math.max(0, bedsWatch - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                  >
                    -
                  </button>
                  <input
                    title="Beds"
                    type="text"
                    readOnly
                    value={bedsWatch}
                    className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("beds", bedsWatch + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    shower
                  </span>{" "}
                  Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("baths", Math.max(0, bathsWatch - 1))
                    }
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                  >
                    -
                  </button>
                  <input
                    title="Baths"
                    type="text"
                    readOnly
                    value={bathsWatch}
                    className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("baths", bathsWatch + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    directions_car
                  </span>{" "}
                  Parking
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("garage", Math.max(0, garageWatch - 1))
                    }
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                  >
                    -
                  </button>
                  <input
                    title="Parking"
                    type="text"
                    readOnly
                    value={garageWatch}
                    className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("garage", garageWatch + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs">
                Amenities
              </h3>
              <div className="space-y-2">
                {AMENITIES_LIST.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {submitError && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                disabled={isPending}
                className="flex-1 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-sf-pro text-sm disabled:opacity-50"
              >
                {isPending
                  ? "Saving..."
                  : property
                    ? "Save Changes"
                    : "Create Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
