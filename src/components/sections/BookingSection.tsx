import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import { format } from "date-fns";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const BookingSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Free Consultation Booking*\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service}\nDate: ${date ? format(date, "PPP") : "Not selected"}\nTime: ${time}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/919346884544?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="booking" className="py-20 bg-muted/50">
        <div className="container max-w-2xl text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Booking Request Sent!</h2>
          <p className="text-muted-foreground mb-6">We'll confirm your consultation shortly via WhatsApp.</p>
          <Button onClick={() => setSubmitted(false)}>Book Another</Button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book Your <span className="gradient-text">Free Consultation</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Schedule a call with our experts to discuss your digital marketing goals
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-card rounded-2xl p-8 shadow-lg border">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="h-5 w-5 text-primary" />
                Select Date & Time
              </div>
              <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} className="rounded-lg border" />
              <div>
                <Label>Select Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <Button key={slot} type="button" variant={time === slot ? "default" : "outline"} size="sm" onClick={() => setTime(slot)} className={time === slot ? "gradient-bg border-0" : ""}>
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Name *</Label><Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div><Label>Phone *</Label><Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div><Label>Email *</Label><Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
              <div>
                <Label>Service Interested In</Label>
                <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
                  <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.shortTitle}>{s.shortTitle}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Message</Label><Textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={3} /></div>
              <Button type="submit" size="lg" className="w-full gradient-bg border-0">Book Free Consultation</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
