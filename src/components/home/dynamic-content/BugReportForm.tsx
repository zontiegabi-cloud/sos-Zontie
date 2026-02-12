import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bug, MessageSquare, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BugReportFormProps {
  webhookUrl?: string;
  className?: string;
}

export function BugReportForm({ webhookUrl, className }: BugReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug',
    title: '',
    description: '',
    contact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast.error("Webhook URL is not configured.");
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct the Discord embed payload
      const payload = {
        username: "Community Report Bot",
        avatar_url: "https://www.shadowsofsoldiers.com/wp-content/uploads/2020/08/cropped-logo-1.png",
        embeds: [
          {
            title: `${formData.type === 'bug' ? '🐛 Bug Report' : '💭 Feedback'}: ${formData.title}`,
            description: formData.description, // Main description allows for more content and better readability
            color: formData.type === 'bug' ? 15158332 : 3066993, // Red for bug, Green for feedback
            fields: [
              {
                name: "Contact (Optional)",
                value: formData.contact || "Anonymous",
                inline: true
              },
              {
                name: "Type",
                value: formData.type.toUpperCase(),
                inline: true
              }
            ],
            footer: {
              text: `Submitted from website • ${new Date().toLocaleString()}`
            }
          }
        ]
      };

      // Send to internal proxy instead of direct Discord URL to avoid CORS
      const response = await fetch('/api/discord-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl,
          payload
        }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Report submitted successfully!");
        setFormData({ type: 'bug', title: '', description: '', contact: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to send to Discord');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto p-8 border border-border bg-card rounded-xl text-center space-y-4"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-heading text-foreground">Thank You!</h3>
        <p className="text-muted-foreground">
          Your report has been sent directly to our development team on Discord. We appreciate your contribution to the community.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
          Submit Another Report
        </Button>
      </motion.div>
    );
  }

  if (!webhookUrl) {
    return (
      <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
        <p>Please configure a Discord Webhook URL in the section editor to enable this form.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 md:p-8 rounded-xl shadow-sm">
        <div className="space-y-2 text-center mb-8">
          <h3 className="text-2xl font-heading tracking-wide uppercase">
            Community Reporting
          </h3>
          <p className="text-muted-foreground">
            Found a bug or have a suggestion? Let us know directly via Discord!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type">Report Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val) => setFormData({...formData, type: val})}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-destructive" />
                    <span>Bug Report</span>
                  </div>
                </SelectItem>
                <SelectItem value="feedback">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span>Feedback / Suggestion</span>
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span>Other</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact (Optional)</Label>
            <Input 
              id="contact" 
              placeholder="Discord Username or Email" 
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Subject</Label>
          <Input 
            id="title" 
            placeholder="Brief summary of the issue" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Please provide details, reproduction steps, or your suggestions..." 
            className="min-h-[120px]"
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending to Discord...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            By submitting, you agree that your message will be posted to our public Discord server.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
