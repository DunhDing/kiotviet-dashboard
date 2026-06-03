'use client';

import { useEffect, useState } from 'react';
import SummaryCards from './SummaryCards';

type ChartComponent = () => React.JSX.Element;

function ChartSlot({ height, children }: { height: number; children?: React.ReactNode }) {
    return <div style={{ minHeight: height }}>{children}</div>;
}

function useClientComponent<T extends React.ComponentType<any>>(loader: () => Promise<{ default: T }>) {
    const [Component, setComponent] = useState<T | null>(null);

    useEffect(() => {
        let active = true;

        loader().then((module) => {
            if (active) {
                setComponent(() => module.default);
            }
        });

        return () => {
            active = false;
        };
    }, [loader]);

    return Component;
}

function RevenueChartLoader() {
    const RevenueChart = useClientComponent(() => import('./RevenueChart'));
    return RevenueChart ? <RevenueChart /> : <ChartSlot height={260} />;
}

function TopListChartsLoader() {
    const TopListCharts = useClientComponent(() => import('./TopListCharts'));
    return TopListCharts ? <TopListCharts /> : <ChartSlot height={320} />;
}

export default function DashboardContent() {
    return (
        <div style={{ flex: 1, minWidth: 0 }}>
            <SummaryCards />
            <RevenueChartLoader />
            <TopListChartsLoader />
        </div>
    );
}
