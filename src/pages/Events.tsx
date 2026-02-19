import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy } from "lucide-react";
import type { RoadmapItem } from "@/lib/content-store";

const EVENT_CATEGORIES = ["event", "tournament", "scrim", "playtest"];

function getCategoryLabel(item: RoadmapItem) {
  const category = (item.category || "").toLowerCase();
  if (category === "tournament") return "Tournament";
  if (category === "scrim") return "Community scrim";
  if (category === "playtest") return "Patch test";
  return "Event";
}

export default function EventsPage() {
  const { roadmap, pages, isLoading } = useContent();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          Loading events...
        </div>
      </Layout>
    );
  }

  const events =
    roadmap
      ?.filter((item) =>
        item.category && EVENT_CATEGORIES.includes(item.category.toLowerCase())
      )
      .sort((a, b) => (a.date || "").localeCompare(b.date || "")) ?? [];

  const page = pages.find((p) => p.slug === "events");

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        {page &&
          page.sections.map((section) => (
            <CustomSectionRenderer key={section.id} section={section} />
          ))}
        <div className="container mx-auto px-4 py-10 space-y-8">

          {events.length === 0 ? (
            <p className="text-muted-foreground">
              No events are scheduled yet. Check back soon or join our Discord for
              announcements.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <Card key={event.id} className="border-border/60 bg-background/70">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getCategoryLabel(event)}</Badge>
                      {event.status && (
                        <Badge
                          variant={
                            event.status === "planned" || event.status === "in-progress"
                              ? "default"
                              : "outline"
                          }
                        >
                          {event.status}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                      {event.date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                      )}
                      {event.category?.toLowerCase() === "tournament" && (
                        <span className="inline-flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          Competitive
                        </span>
                      )}
                      {event.image && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Online
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {event.description}
                      </p>
                    )}
                    {event.image && (
                      <div className="mt-2 overflow-hidden rounded-md border border-border/40">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
