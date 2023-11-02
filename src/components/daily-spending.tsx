'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTheme } from 'next-themes';
import { useConfig } from '@/hooks/use-config';
import { themes } from '@/registry/themes';

const data = [
  {
    revenue: 10400,
    subscription: 240,
  },
  {
    revenue: 14405,
    subscription: 300,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 189,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 278,
  },
  {
    revenue: 26475,
    subscription: 189,
  },
];

export default function DailySpending() {
  const { theme: mode } = useTheme();
  const [config] = useConfig();

  const theme = themes.find((theme) => theme.name === config.theme);

  return (
    <Card className="col-span-3 border-muted-foreground">
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Daily Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$1290.29</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Line
                type={'monotone'}
                strokeWidth={2}
                dataKey={'revenue'}
                activeDot={{
                  r: 6,
                  style: { fill: 'var(--theme-primary)', opacity: 0.25 },
                }}
                style={
                  {
                    stroke: 'var(--theme-primary)',
                    '--theme-primary': `hsl(${
                      theme?.cssVars[mode === 'dark' ? 'dark' : 'light'].primary
                    })`,
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
