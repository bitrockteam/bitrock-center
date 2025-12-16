export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDaysFromStart = (date: Date, startDate: Date): number => {
  const start = new Date(startDate);
  const target = new Date(date);
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export type AllocationBar = {
  startOffset: number;
  width: number;
  percentage: number;
  startDate: Date;
  endDate: Date | null;
  workItemId: string;
  workItemTitle: string;
};

export const getAllocationBarPosition = (
  allocationStart: Date,
  allocationEnd: Date | null,
  dateRangeStart: Date,
  dateRangeEnd: Date
): AllocationBar | null => {
  const rangeStart = new Date(dateRangeStart);
  const rangeEnd = new Date(dateRangeEnd);
  const allocStart = new Date(allocationStart);
  const allocEnd = allocationEnd ? new Date(allocationEnd) : rangeEnd;

  // Check if allocation overlaps with date range
  if (allocEnd < rangeStart || allocStart > rangeEnd) {
    return null;
  }

  // Calculate the actual start and end within the range
  const barStart = allocStart < rangeStart ? rangeStart : allocStart;
  const barEnd = allocEnd > rangeEnd ? rangeEnd : allocEnd;

  // Calculate offset and width in days
  const startOffset = getDaysFromStart(barStart, rangeStart);
  const width = getDaysBetween(barStart, barEnd) + 1; // +1 to include both start and end days

  return {
    startOffset,
    width,
    percentage: 0, // Will be set by caller
    startDate: allocStart,
    endDate: allocationEnd,
    workItemId: "", // Will be set by caller
    workItemTitle: "", // Will be set by caller
  };
};

export const getDefaultDateRange = (): { start: Date; end: Date } => {
  const start = new Date();
  start.setDate(1); // First day of current month
  const end = new Date();
  end.setMonth(end.getMonth() + 3); // 3 months ahead
  end.setDate(0); // Last day of that month
  return { start, end };
};

