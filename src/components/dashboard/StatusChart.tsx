import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { SiteStatus } from '@/services/dashboardService';

// Chart.js 등록 - 컴포넌트 외부에서 등록
ChartJS.register(...registerables);

interface StatusChartProps {
  sites: SiteStatus[];
}

const StatusChart: React.FC<StatusChartProps> = ({ sites }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // 차트 인스턴스가 이미 존재하면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // canvas 요소가 존재하는지 확인
    const canvas = chartRef.current;
    if (!canvas) return;

    // 차트 데이터 준비
    const labels = sites.map(site => site.siteName);

    // 새 차트 인스턴스 생성 - 스택 형태가 아닌 병렬 형태로 변경
    chartInstance.current = new ChartJS(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '완료 요청',
            data: sites.map(site => site.completedRequests),
            backgroundColor: '#4ade80',
            // 스택 속성 제거
          },
          {
            label: '미완료 요청',
            data: sites.map(site => site.pendingRequests),
            backgroundColor: '#fbbf24',
            // 스택 속성 제거
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '사이트별 요청 현황',
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            // 스택 비활성화 (기본값이 false)
          },
          y: {
            // 스택 비활성화 (기본값이 false)
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      // 컴포넌트 언마운트 시 차트 인스턴스 파괴
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sites]); // sites 배열이 변경될 때 차트 다시 그리기

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default StatusChart;
