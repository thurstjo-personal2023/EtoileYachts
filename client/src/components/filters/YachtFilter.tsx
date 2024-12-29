import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { SearchBar } from "@/components/search/SearchBar";
import { useQuery } from "@tanstack/react-query";

// Enhanced filter schema with search
const filterSchema = z.object({
  search: z.string().optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  length: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  capacity: z.number().min(1),
  features: z.array(z.string()),
  location: z.string().optional(),
  activityTypes: z.array(z.string()).default([]),
});

type FilterValues = z.infer<typeof filterSchema>;

interface YachtFilterProps {
  onFilter: (values: FilterValues) => void;
  className?: string;
  initialValues?: Partial<FilterValues>;
}

const ACTIVITY_TYPES = [
  'Day Charter',
  'Week Charter',
  'Corporate Events',
  'Special Occasions',
  'Water Sports',
  'Fishing',
];

export function YachtFilter({ onFilter, className, initialValues }: YachtFilterProps) {
  const [priceRange, setPriceRange] = useState([
    initialValues?.priceRange?.min || 0,
    initialValues?.priceRange?.max || 10000
  ]);

  const [lengthRange, setLengthRange] = useState([
    initialValues?.length?.min || 0,
    initialValues?.length?.max || 100
  ]);

  // Query for search results
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['yacht-search', initialValues?.search],
    enabled: !!initialValues?.search,
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${initialValues?.search}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    }
  });

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
      priceRange: { min: priceRange[0], max: priceRange[1] },
      length: { min: lengthRange[0], max: lengthRange[1] },
      capacity: 1,
      features: [],
      activityTypes: [],
      ...initialValues
    },
  });

  const handleSubmit = (values: FilterValues) => {
    onFilter(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <SearchBar
                  placeholder="Search yachts and locations..."
                  onSearch={(query) => field.onChange(query)}
                  onSelect={(result) => {
                    field.onChange(result.title);
                    if (result.type === 'location') {
                      form.setValue('location', result.title);
                    }
                  }}
                  results={searchResults}
                  isLoading={isSearching}
                  className="w-full"
                />
              </FormItem>
            )}
          />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0}
                            max={10000}
                            step={100}
                            value={[priceRange[0], priceRange[1]]}
                            onValueChange={(value) => {
                              setPriceRange(value);
                              field.onChange({ min: value[0], max: value[1] });
                            }}
                          />
                          <div className="flex justify-between text-sm">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="activities">
              <AccordionTrigger>Activity Types</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="activityTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {ACTIVITY_TYPES.map((activity) => (
                            <label
                              key={activity}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={field.value.includes(activity)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, activity]
                                    : field.value.filter((v) => v !== activity);
                                  field.onChange(newValue);
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm">{activity}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="length">
              <AccordionTrigger>Yacht Length</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            value={[lengthRange[0], lengthRange[1]]}
                            onValueChange={(value) => {
                              setLengthRange(value);
                              field.onChange({ min: value[0], max: value[1] });
                            }}
                          />
                          <div className="flex justify-between text-sm">
                            <span>{lengthRange[0]}m</span>
                            <span>{lengthRange[1]}m</span>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="capacity">
              <AccordionTrigger>Guest Capacity</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 4, 6, 8, 10, 12].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} guests
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location">
              <AccordionTrigger>Location</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter location"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="submit" className="w-full mt-4">
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}