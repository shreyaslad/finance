'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

type InfoCardProps = {
  title: string;
  value: any;
  Icon: LucideIcon;
};

export default function InfoCard({ title, value, Icon }: InfoCardProps) {
  return (
    <Card className="col-span-2 border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {/* {isLoading ? (
          <Skeleton className="h-4 w-[250px]" />
        ) : ( */}
        <div className="text-3xl font-bold">{value}</div>
        {/* )} */}
      </CardContent>
    </Card>
  );
}
