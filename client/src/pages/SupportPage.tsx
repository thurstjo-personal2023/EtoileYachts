import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LifeBuoy, MessageCircle, Phone, Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container py-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Support</h1>
        
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Chat Support</h3>
                  <p className="text-sm text-muted-foreground">Get instant help from our team</p>
                </div>
              </div>
              <Button className="w-full mt-3">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-sm text-muted-foreground">Speak directly with our support team</p>
                </div>
              </div>
              <Button className="w-full mt-3" variant="outline">+1 (555) 123-4567</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-muted-foreground">Send us your questions</p>
                </div>
              </div>
              <Button className="w-full mt-3" variant="outline">support@etoileyachts.com</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
