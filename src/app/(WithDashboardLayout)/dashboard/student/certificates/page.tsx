"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Download, Calendar, Award } from "lucide-react";

export default function StudentCertificates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Certificate Card 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Web Development Fundamentals
              </CardTitle>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <CardDescription>Completed on December 15, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Issued: Dec 15, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Grade: A</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Card 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                JavaScript Essentials
              </CardTitle>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <CardDescription>Completed on November 20, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Issued: Nov 20, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Grade: A-</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Card 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                React.js Basics
              </CardTitle>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <CardDescription>Completed on October 5, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Issued: Oct 5, 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Grade: B+</span>
              </div>
              <Button className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Statistics</CardTitle>
          <CardDescription>Your achievement summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground">Total Certificates</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">A-</div>
              <p className="text-sm text-muted-foreground">Average Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}