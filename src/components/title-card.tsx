import { DollarSign, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ComponentType, ReactComponentElement, ReactElement } from 'react';

type TitleCardProps = {
  title: string;
  value: string;
  Icon: LucideIcon;
};

export default function TitleCard({ title, value, Icon }: TitleCardProps) {
  return (
    <Card className="col-span-2 border-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4" />
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
