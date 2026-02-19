import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ClassItem, WeaponItem, WeaponAttachment } from "@/lib/content-store";
import { ClassesContentCard } from "@/components/game/ClassesContentCard";
import { StatBar } from "@/components/game/StatBar";

function getInitialFromSearch<T extends string>(
  key: string,
  validIds: string[],
  defaultValue?: T
): T | undefined {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key) as T | null;
  if (value && validIds.includes(value)) {
    return value;
  }
  return defaultValue;
}

function parseAttachmentIds(validIds: string[]): string[] {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("attachments");
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => validIds.includes(v));
}

const LoadoutsPage = () => {
  const { classes, weapons, pages, isLoading } = useContent();

  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<string | undefined>();
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<string | undefined>();
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState("");

  const primaryWeapons = useMemo(
    () =>
      weapons.filter((w) =>
        ["assault", "smg", "lmg", "sniper", "shotgun"].includes(w.category)
      ),
    [weapons]
  );

  const secondaryWeapons = useMemo(
    () => weapons.filter((w) => ["pistol", "smg", "melee"].includes(w.category)),
    [weapons]
  );

  const attachments: WeaponAttachment[] = useMemo(() => {
    const primary = weapons.find((w) => w.id === selectedPrimaryId);
    return primary?.attachments || [];
  }, [weapons, selectedPrimaryId]);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );

  const selectedPrimary = useMemo(
    () => weapons.find((w) => w.id === selectedPrimaryId),
    [weapons, selectedPrimaryId]
  );

  const selectedSecondary = useMemo(
    () => weapons.find((w) => w.id === selectedSecondaryId),
    [weapons, selectedSecondaryId]
  );

  useEffect(() => {
    if (isLoading) return;
    const classIds = classes.map((c) => c.id);
    const weaponIds = weapons.map((w) => w.id);
    const attachmentIds = weapons.flatMap((w) => w.attachments.map((a) => a.id));

    setSelectedClassId((prev) => prev || getInitialFromSearch("classId", classIds));
    setSelectedPrimaryId(
      (prev) => prev || getInitialFromSearch("primaryId", weaponIds)
    );
    setSelectedSecondaryId(
      (prev) => prev || getInitialFromSearch("secondaryId", weaponIds)
    );
    setSelectedAttachmentIds((prev) =>
      prev.length ? prev : parseAttachmentIds(attachmentIds)
    );
  }, [isLoading, classes, weapons]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedClassId) params.set("classId", selectedClassId);
    if (selectedPrimaryId) params.set("primaryId", selectedPrimaryId);
    if (selectedSecondaryId) params.set("secondaryId", selectedSecondaryId);
    if (selectedAttachmentIds.length) {
      params.set("attachments", selectedAttachmentIds.join(","));
    }
    const url = `${window.location.origin}/loadouts${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    setShareUrl(url);
  }, [selectedClassId, selectedPrimaryId, selectedSecondaryId, selectedAttachmentIds]);

  const toggleAttachment = (id: string) => {
    setSelectedAttachmentIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const page = pages.find((p) => p.slug === "loadouts");

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          Loading loadouts...
        </div>
      </Layout>
    );
  }

  if (!classes.length || !weapons.length) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">
            No classes or weapons configured yet. Please add them in the admin panel.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        {page &&
          page.sections.map((section) => (
            <CustomSectionRenderer key={section.id} section={section} />
          ))}
        <div className="container mx-auto px-4 py-10 space-y-8">

          <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr] items-start">
            <Card>
              <CardHeader>
                <CardTitle>Configure Loadout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">Class</h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    {classes.map((cls: ClassItem, index) => (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => setSelectedClassId(cls.id)}
                        className="text-left"
                      >
                        <ClassesContentCard
                          item={cls}
                          index={index}
                          isSelected={cls.id === selectedClassId}
                          showHoverInfo={false}
                        />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">Primary Weapon</h2>
                  <Select
                    value={selectedPrimaryId}
                    onValueChange={setSelectedPrimaryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select primary weapon" />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryWeapons.map((w: WeaponItem) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} ({w.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">Secondary Weapon</h2>
                  <Select
                    value={selectedSecondaryId}
                    onValueChange={setSelectedSecondaryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select secondary weapon" />
                    </SelectTrigger>
                    <SelectContent>
                      {secondaryWeapons.map((w: WeaponItem) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} ({w.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">Attachments</h2>
                  {attachments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Select a primary weapon to view its attachments.
                    </p>
                  )}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((att) => (
                        <Button
                          key={att.id}
                          type="button"
                          variant={
                            selectedAttachmentIds.includes(att.id)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleAttachment(att.id)}
                        >
                          {att.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </section>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Build Summary & Share</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <section className="space-y-2">
                  <p className="text-sm text-muted-foreground">Selected class</p>
                  {selectedClass ? (
                    <div className="space-y-1">
                      <p className="font-semibold">{selectedClass.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedClass.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No class selected.
                    </p>
                  )}
                </section>

                <section className="space-y-2">
                  <p className="text-sm text-muted-foreground">Weapons</p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Primary: </span>
                      {selectedPrimary ? (
                        <>
                          {selectedPrimary.name}{" "}
                          <Badge variant="outline">{selectedPrimary.category}</Badge>
                        </>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Secondary: </span>
                      {selectedSecondary ? (
                        <>
                          {selectedSecondary.name}{" "}
                          <Badge variant="outline">
                            {selectedSecondary.category}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                </section>

                {(selectedPrimary || selectedSecondary) && (
                  <section className="space-y-3">
                    <p className="text-sm text-muted-foreground">Weapon stats</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPrimary && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            Primary: {selectedPrimary.name}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <StatBar label="Damage" value={selectedPrimary.stats.damage} />
                            <StatBar label="Accuracy" value={selectedPrimary.stats.accuracy} />
                            <StatBar label="Range" value={selectedPrimary.stats.range} />
                            <StatBar label="Fire Rate" value={selectedPrimary.stats.fireRate} />
                            <StatBar label="Mobility" value={selectedPrimary.stats.mobility} />
                            <StatBar label="Control" value={selectedPrimary.stats.control} />
                          </div>
                        </div>
                      )}
                      {selectedSecondary && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            Secondary: {selectedSecondary.name}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <StatBar label="Damage" value={selectedSecondary.stats.damage} />
                            <StatBar label="Accuracy" value={selectedSecondary.stats.accuracy} />
                            <StatBar label="Range" value={selectedSecondary.stats.range} />
                            <StatBar label="Fire Rate" value={selectedSecondary.stats.fireRate} />
                            <StatBar label="Mobility" value={selectedSecondary.stats.mobility} />
                            <StatBar label="Control" value={selectedSecondary.stats.control} />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                <section className="space-y-2">
                  <p className="text-sm text-muted-foreground">Attachments</p>
                  {selectedAttachmentIds.length === 0 ? (
                    <p className="text-sm text-muted-foreground">None selected.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {attachments
                        .filter((att) => selectedAttachmentIds.includes(att.id))
                        .map((att) => (
                          <Badge key={att.id} variant="secondary">
                            {att.name}
                          </Badge>
                        ))}
                    </div>
                  )}
                </section>

                <section className="space-y-2">
                  <p className="text-sm text-muted-foreground">Shareable link</p>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly className="text-xs" />
                    <Button type="button" onClick={handleCopyShareUrl}>
                      Copy
                    </Button>
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default LoadoutsPage;
