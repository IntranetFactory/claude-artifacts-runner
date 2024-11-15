import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({ id: 0, title: '', date: '', time: '', duration: '1' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getWeekDays = () => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() - current.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ':00'
  );

  const prevPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ id: 0, title: '', date: '', time: '', duration: '1' });
      setIsDialogOpen(false);
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getEventsForTimeSlot = (day: Date, time: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventTime = event.time.split(':')[0];
      return eventDate.toDateString() === day.toDateString() && eventTime === time.split(':')[0];
    });
  };

  const WeekView: React.FC = () => (
    <div className="grid grid-cols-8 gap-2 mb-4">
      <div className="sticky top-0 bg-white z-10"></div>
      {getWeekDays().map((day) => (
        <div key={day.toDateString()} className="text-center font-bold sticky top-0 bg-white z-10">
          <div>{day.toLocaleDateString('default', { weekday: 'short' })}</div>
          <div className="text-sm">{day.getDate()}</div>
        </div>
      ))}
      
      {timeSlots.map((time) => (
        <React.Fragment key={time}>
          <div className="text-right pr-2 text-sm text-gray-500">{time}</div>
          {getWeekDays().map((day) => (
            <div key={`${day.toDateString()}-${time}`} className="border border-gray-200 h-12 relative">
              {getEventsForTimeSlot(day, time).map((event) => (
                <div 
                  key={event.id} 
                  className="absolute top-0 left-0 right-0 bg-blue-100 p-1 text-xs rounded overflow-hidden"
                  style={{ height: `${Number(event.duration) * 48}px` }}
                >
                  <div className="flex justify-between items-center">
                    <span>{event.title}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteEvent(event.id)}
                      className="h-4 w-4 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  const MonthView: React.FC = () => (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="text-center font-bold">
          {day}
        </div>
      ))}
      {[...Array(firstDayOfMonth).keys()].map((_, index) => (
        <div key={`empty-${index}`} className="h-24"></div>
      ))}
      {[...Array(daysInMonth).keys()].map((day) => (
        <div key={day} className="border p-2 h-24 overflow-y-auto">
          <div className="font-bold">{day + 1}</div>
          {events
            .filter(
              (event) =>
                new Date(event.date).toDateString() ===
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toDateString()
            )
            .map((event) => (
              <div key={event.id} className="bg-blue-100 p-1 mb-1 rounded flex justify-between items-center">
                <span>{event.title} {event.time && `- ${event.time}`}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteEvent(event.id)}
                  className="h-4 w-4 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {view === 'month' 
            ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
            : `Week of ${getWeekDays()[0].toLocaleDateString()}`
          }
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={view === 'month' ? 'default' : 'outline'} 
              onClick={() => setView('month')}
              size="sm"
            >
              Month
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              onClick={() => setView('week')}
              size="sm"
            >
              Week
            </Button>
          </div>
          <div className="flex items-center">
            <Button onClick={prevPeriod} variant="outline" size="icon" className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={nextPeriod} variant="outline" size="icon" className="mr-4">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm">Duration (hours):</label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-20"
                  />
                </div>
                <Button onClick={addEvent}>Add Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === 'month' ? <MonthView /> : <WeekView />}
    </div>
  );
};

export default Calendar;