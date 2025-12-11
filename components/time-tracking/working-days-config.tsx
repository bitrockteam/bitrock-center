"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useState } from "react";

type WorkingDay = { day: string; hours: string; lunch: string };
type Holiday = { name: string; date: string };
type Event = { name: string; date: string };

const defaultWorkingDays: WorkingDay[] = [
  { day: "Monday", hours: "09:00-18:00", lunch: "13:00-14:00" },
  { day: "Tuesday", hours: "09:00-18:00", lunch: "13:00-14:00" },
  { day: "Wednesday", hours: "09:00-18:00", lunch: "13:00-14:00" },
  { day: "Thursday", hours: "09:00-18:00", lunch: "13:00-14:00" },
  { day: "Friday", hours: "09:00-18:00", lunch: "13:00-14:00" },
];

const defaultHolidays: Holiday[] = [
  { name: "Christmas", date: "2024-12-25" },
  { name: "Easter", date: "2024-03-31" },
];
const defaultEvents: Event[] = [{ name: "Company Convention", date: "2024-09-15" }];

const WorkingDaysConfig = () => {
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(defaultWorkingDays);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editHours, setEditHours] = useState("");
  const [editLunch, setEditLunch] = useState("");

  // Holidays
  const [holidays, setHolidays] = useState<Holiday[]>(defaultHolidays);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [editHolidayIndex, setEditHolidayIndex] = useState<number | null>(null);
  const [editHolidayName, setEditHolidayName] = useState("");
  const [editHolidayDate, setEditHolidayDate] = useState("");

  // Events
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [editEventIndex, setEditEventIndex] = useState<number | null>(null);
  const [editEventName, setEditEventName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");

  // Working Days Handlers
  const handleEditDay = (idx: number) => {
    setEditIndex(idx);
    setEditHours(workingDays[idx].hours);
    setEditLunch(workingDays[idx].lunch);
  };
  const handleSaveDay = (idx: number) => {
    const updated = [...workingDays];
    updated[idx] = { ...updated[idx], hours: editHours, lunch: editLunch };
    setWorkingDays(updated);
    setEditIndex(null);
  };

  // Holiday Handlers
  const handleAddHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) return;
    setHolidays([...holidays, { name: newHolidayName.trim(), date: newHolidayDate }]);
    setNewHolidayName("");
    setNewHolidayDate("");
  };
  const handleRemoveHoliday = (idx: number) => {
    setHolidays(holidays.filter((_, i) => i !== idx));
  };
  const handleEditHoliday = (idx: number) => {
    setEditHolidayIndex(idx);
    setEditHolidayName(holidays[idx].name);
    setEditHolidayDate(holidays[idx].date);
  };
  const handleSaveHoliday = (idx: number) => {
    if (!editHolidayName.trim() || !editHolidayDate) return;
    const updated = [...holidays];
    updated[idx] = { name: editHolidayName.trim(), date: editHolidayDate };
    setHolidays(updated);
    setEditHolidayIndex(null);
  };

  // Event Handlers
  const handleAddEvent = () => {
    if (!newEventName.trim() || !newEventDate) return;
    setEvents([...events, { name: newEventName.trim(), date: newEventDate }]);
    setNewEventName("");
    setNewEventDate("");
  };
  const handleRemoveEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
  };
  const handleEditEvent = (idx: number) => {
    setEditEventIndex(idx);
    setEditEventName(events[idx].name);
    setEditEventDate(events[idx].date);
  };
  const handleSaveEvent = (idx: number) => {
    if (!editEventName.trim() || !editEventDate) return;
    const updated = [...events];
    updated[idx] = { name: editEventName.trim(), date: editEventDate };
    setEvents(updated);
    setEditEventIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg p-6 space-y-8"
        aria-label="Working Days and Events Configuration"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div>
          <h2 className="text-lg font-semibold mb-2">Working Days</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Lunch</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workingDays.map((day, idx) => (
                <TableRow
                  key={day.day}
                  className="group/row transition-all duration-300 hover:bg-muted/50"
                >
                  <TableCell className="group-hover/row:text-primary transition-colors">
                    {day.day}
                  </TableCell>
                  <TableCell>
                    {editIndex === idx ? (
                      <Input
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                        aria-label={`Edit hours for ${day.day}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveDay(idx)}
                        className="w-32"
                      />
                    ) : (
                      day.hours
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === idx ? (
                      <Input
                        value={editLunch}
                        onChange={(e) => setEditLunch(e.target.value)}
                        aria-label={`Edit lunch for ${day.day}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveDay(idx)}
                        className="w-32"
                      />
                    ) : (
                      day.lunch
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === idx ? (
                      <Button
                        onClick={() => handleSaveDay(idx)}
                        aria-label={`Save ${day.day}`}
                        tabIndex={0}
                        size="sm"
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEditDay(idx)}
                        aria-label={`Edit ${day.day}`}
                        tabIndex={0}
                        size="sm"
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Holidays</h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <Input
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                placeholder="Holiday name"
                aria-label="Add holiday name"
                tabIndex={0}
                className="w-48"
              />
              <Input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                placeholder="Holiday date"
                aria-label="Add holiday date"
                tabIndex={0}
                className="w-40"
              />
              <Button onClick={handleAddHoliday} aria-label="Add holiday" tabIndex={0} size="sm">
                Add
              </Button>
            </div>
            <ul className="list-disc pl-5">
              {holidays.map((holiday, idx) => (
                <li
                  key={holiday.name + holiday.date}
                  className="flex items-center justify-between gap-2"
                >
                  {editHolidayIndex === idx ? (
                    <div className="flex gap-2 flex-wrap items-center">
                      <Input
                        value={editHolidayName}
                        onChange={(e) => setEditHolidayName(e.target.value)}
                        aria-label="Edit holiday name"
                        tabIndex={0}
                        className="w-48"
                      />
                      <Input
                        type="date"
                        value={editHolidayDate}
                        onChange={(e) => setEditHolidayDate(e.target.value)}
                        aria-label="Edit holiday date"
                        tabIndex={0}
                        className="w-40"
                      />
                      <Button
                        onClick={() => handleSaveHoliday(idx)}
                        aria-label="Save holiday"
                        tabIndex={0}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{holiday.name}</span>
                      <span className="text-xs text-gray-500">{holiday.date}</span>
                      <Button
                        onClick={() => handleEditHoliday(idx)}
                        aria-label={`Edit ${holiday.name}`}
                        tabIndex={0}
                        size="icon"
                        variant="ghost"
                      >
                        ✎
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={() => handleRemoveHoliday(idx)}
                    aria-label={`Remove ${holiday.name}`}
                    tabIndex={0}
                    size="icon"
                    variant="ghost"
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Company Events</h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <Input
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="Event name"
                aria-label="Add event name"
                tabIndex={0}
                className="w-48"
              />
              <Input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                placeholder="Event date"
                aria-label="Add event date"
                tabIndex={0}
                className="w-40"
              />
              <Button onClick={handleAddEvent} aria-label="Add event" tabIndex={0} size="sm">
                Add
              </Button>
            </div>
            <ul className="list-disc pl-5">
              {events.map((event, idx) => (
                <li
                  key={event.name + event.date}
                  className="flex items-center justify-between gap-2"
                >
                  {editEventIndex === idx ? (
                    <div className="flex gap-2 flex-wrap items-center">
                      <Input
                        value={editEventName}
                        onChange={(e) => setEditEventName(e.target.value)}
                        aria-label="Edit event name"
                        tabIndex={0}
                        className="w-48"
                      />
                      <Input
                        type="date"
                        value={editEventDate}
                        onChange={(e) => setEditEventDate(e.target.value)}
                        aria-label="Edit event date"
                        tabIndex={0}
                        className="w-40"
                      />
                      <Button
                        onClick={() => handleSaveEvent(idx)}
                        aria-label="Save event"
                        tabIndex={0}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{event.name}</span>
                      <span className="text-xs text-gray-500">{event.date}</span>
                      <Button
                        onClick={() => handleEditEvent(idx)}
                        aria-label={`Edit ${event.name}`}
                        tabIndex={0}
                        size="icon"
                        variant="ghost"
                      >
                        ✎
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={() => handleRemoveEvent(idx)}
                    aria-label={`Remove ${event.name}`}
                    tabIndex={0}
                    size="icon"
                    variant="ghost"
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WorkingDaysConfig;
