import AvailabilitySlot from "@/lib/models/AvailabilitySlot";

interface SlotInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  specificDate?: string;
}

interface OverlapQuery {
  tenantId: string;
  providerId: string;
  slot: SlotInput;
  excludeId?: string;
}

function timesOverlap(a: string, b: string, c: string, d: string): boolean {
  return a < d && c < b;
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

/**
 * Check whether a proposed slot overlaps any existing slot for the same
 * provider+tenant. Returns the first conflicting slot if found, or null.
 *
 * Covers:
 *  - Recurring vs recurring on the same dayOfWeek
 *  - Date-specific vs date-specific on the same date
 *  - Cross-type: date-specific vs recurring on that dayOfWeek
 */
export async function findOverlappingSlot(
  query: OverlapQuery
): Promise<Record<string, unknown> | null> {
  const { tenantId, providerId, slot, excludeId } = query;

  const existingSlots = await AvailabilitySlot.find({
    tenantId,
    providerId,
  }).lean();

  for (const existing of existingSlots) {
    if (excludeId && existing._id?.toString() === excludeId) continue;

    const e = existing as Record<string, unknown>;

    const isExistingDateSpecific = e.specificDate != null;
    const existingDayOfWeek = e.dayOfWeek as number;
    const existingSpecificDate = e.specificDate as Date | undefined;

    let matches = false;

    if (slot.specificDate) {
      // Proposed date-specific slot
      const slotDate = new Date(slot.specificDate);
      const slotDayOfWeek = slot.dayOfWeek;

      if (isExistingDateSpecific && existingSpecificDate) {
        // Both date-specific: same date
        matches = toDateStr(slotDate) === toDateStr(existingSpecificDate);
      } else if (!isExistingDateSpecific) {
        // Existing recurring: same dayOfWeek
        matches = existingDayOfWeek === slotDayOfWeek;
      }
    } else {
      // Proposed recurring slot
      if (!isExistingDateSpecific) {
        // Both recurring: same dayOfWeek
        matches = existingDayOfWeek === slot.dayOfWeek;
      } else if (existingSpecificDate) {
        // Existing date-specific: does its date fall on the proposed dayOfWeek?
        matches = new Date(existingSpecificDate).getDay() === slot.dayOfWeek;
      }
    }

    if (matches && timesOverlap(e.startTime as string, e.endTime as string, slot.startTime, slot.endTime)) {
      return existing;
    }
  }

  return null;
}
